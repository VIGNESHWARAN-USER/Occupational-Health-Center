import React, { useState } from "react";

function InvestigationForm({data}) {
  const [selectedOption, setSelectedOption] = useState(""); 
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

      {selectedOption === "HAEMATALOGY" && (
  <div>
    <div className="grid grid-cols-4 gap-4">
      {Object.keys(data[0]?.haematology || {}).slice(2).map((key, index) => (
        <div key={index} className="col-span-1">
          <label htmlFor={key} className="block text-sm font-medium text-gray-700">
            {key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
          </label>
          <div className="mt-1">
            {key.includes("comments") ? (
              <textarea
                id={key}
                className="py-2 px-4 ms-4 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
                defaultValue={data[0]?.haematology[key] || ""}
              />
            ) : (
              <input
                type="text"
                id={key}
                className="py-3 px-4 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={data[0]?.haematology[key] || ""}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)}




{selectedOption === "ROUTINE SUGAR TESTS" && (
 <div>
 <div className="grid grid-cols-4 gap-4">
   {Object.keys(data[0]?.routinesugartests || {}).slice(2).map((key, index) => (
     <div key={index} className="col-span-1">
       <label htmlFor={key} className="block text-sm font-medium text-gray-700">
         {key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
       </label>
       <div className="mt-1">
         {key.includes("comments") ? (
           <textarea
             id={key}
             className="py-2 px-4 ms-4 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
             defaultValue={data[0]?.routinesugartests[key] || ""}
           />
         ) : (
           <input
             type="text"
             id={key}
             className="py-3 px-4 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
             defaultValue={data[0]?.haematology[key] || ""}
           />
         )}
       </div>
     </div>
   ))}
 </div>
</div>
)}

      {/* {selectedOption === "RENAL FUNCTION TEST & ELECTROLYTES" && (
  <div>
  <div className="grid grid-cols-4 gap-4">
    {Object.keys(data[0]?.haematology || {}).slice(2).map((key, index) => (
      <div key={index} className="col-span-1">
        <label htmlFor={key} className="block text-sm font-medium text-gray-700">
          {key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
        </label>
        <div className="mt-1">
          {key.includes("comments") ? (
            <textarea
              id={key}
              className="py-2 px-4 ms-4 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
              defaultValue={data[0]?.haematology[key] || ""}
            />
          ) : (
            <input
              type="text"
              id={key}
              className="py-3 px-4 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={data[0]?.haematology[key] || ""}
            />
          )}
        </div>
      </div>
    ))}
  </div>
</div>
)}
 */}

      {selectedOption === "LIPID PROFILE" && (
  <div>
  <div className="grid grid-cols-4 gap-4">
    {Object.keys(data[0]?.lipidprofile || {}).slice(2).map((key, index) => (
      <div key={index} className="col-span-1">
        <label htmlFor={key} className="block text-sm font-medium text-gray-700">
          {key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
        </label>
        <div className="mt-1">
          {key.includes("comments") ? (
            <textarea
              id={key}
              className="py-2 px-4 ms-4 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
              defaultValue={data[0]?.lipidprofile[key] || ""}
            />
          ) : (
            <input
              type="text"
              id={key}
              className="py-3 px-4 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={data[0]?.haematology[key] || ""}
            />
          )}
        </div>
      </div>
    ))}
  </div>
</div>
)}


       {selectedOption === "LIVER FUNCTION TEST" && (
  <div>
    <h3 className="text-lg font-medium">LIVER FUNCTION TEST</h3>
    {/* Add specific input fields for this option */}
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-1">
        <label htmlFor="BilirubinTotal" className="block text-sm font-medium text-gray-700">
          Bilirubin - Total
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="BilirubinTotal"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="BilirubinTotalUnit" className="block text-sm font-medium text-gray-700">
          Unit (in mg/dL)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="BilirubinTotalUnit"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="BilirubinTotalReferenceRange" className="block text-sm font-medium text-gray-700">
          Reference Range
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="BilirubinTotalReferenceRange"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="BilirubinTotalComments" className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <div className="mt-1">
          <textarea
            id="BilirubinTotalComments"
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"  // Reduced height
          />
        </div>
      </div>
      <div className="col-span-1">
        <label htmlFor="BilirubinDirect" className="block text-sm font-medium text-gray-700">
          Bilirubin - Direct
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="BilirubinDirect"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="BilirubinDirectUnit" className="block text-sm font-medium text-gray-700">
          Unit (in mg/dL)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="BilirubinDirectUnit"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="BilirubinDirectReferenceRange" className="block text-sm font-medium text-gray-700">
          Reference Range
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="BilirubinDirectReferenceRange"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="BilirubinDirectComments" className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <div className="mt-1">
          <textarea
            id="BilirubinDirectComments"
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"  // Reduced height
          />
        </div>
      </div>
      <div className="col-span-1">
        <label htmlFor="BilirubinIndirect" className="block text-sm font-medium text-gray-700">
          Bilirubin - Indirect
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="BilirubinIndirect"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="BilirubinIndirectUnit" className="block text-sm font-medium text-gray-700">
          Unit (in mg/dL)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="BilirubinIndirectUnit"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="BilirubinIndirectReferenceRange" className="block text-sm font-medium text-gray-700">
          Reference Range
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="BilirubinIndirectReferenceRange"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="BilirubinIndirectComments" className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <div className="mt-1">
          <textarea
            id="BilirubinIndirectComments"
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"  // Reduced height
          />
        </div>
      </div>
      <div className="col-span-1">
        <label htmlFor="SGOT" className="block text-sm font-medium text-gray-700">
          SGOT /AST
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="SGOT"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="SGOTUnit" className="block text-sm font-medium text-gray-700">
          Unit (in mg/dL)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="SGOTUnit"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="SGOTReferenceRange" className="block text-sm font-medium text-gray-700">
          Reference Range
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="SGOTReferenceRange"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="SGOTComments" className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <div className="mt-1">
          <textarea
            id="SGOTComments"
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"  // Reduced height
          />
        </div>
      </div>
      <div className="col-span-1">
        <label htmlFor="SGPT" className="block text-sm font-medium text-gray-700">
          SGPT /ALT
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="SGPT"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="SGPTUnit" className="block text-sm font-medium text-gray-700">
          Unit (in mg/dL)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="SGPTUnit"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="SGPTReferenceRange" className="block text-sm font-medium text-gray-700">
          Reference Range
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="SGPTReferenceRange"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="SGPTComments" className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <div className="mt-1">
          <textarea
            id="SGPTComments"
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"  // Reduced height
          />
        </div>
      </div>
      <div className="col-span-1">
        <label htmlFor="AlkalinePhosphatase" className="block text-sm font-medium text-gray-700">
          Alkaline phosphatase
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="AlkalinePhosphatase"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="AlkalinePhosphataseUnit" className="block text-sm font-medium text-gray-700">
          Unit (in mg/dL)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="AlkalinePhosphataseUnit"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="AlkalinePhosphataseReferenceRange" className="block text-sm font-medium text-gray-700">
          Reference Range
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="AlkalinePhosphataseReferenceRange"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="AlkalinePhosphataseComments" className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <div className="mt-1">
          <textarea
            id="AlkalinePhosphataseComments"
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"  // Reduced height
          />
        </div>
      </div>
      <div className="col-span-1">
        <label htmlFor="TotalProtein" className="block text-sm font-medium text-gray-700">
          Total Protein
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="TotalProtein"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="TotalProteinUnit" className="block text-sm font-medium text-gray-700">
          Unit (in mg/dL)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="TotalProteinUnit"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="TotalProteinReferenceRange" className="block text-sm font-medium text-gray-700">
          Reference Range
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="TotalProteinReferenceRange"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="TotalProteinComments" className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <div className="mt-1">
          <textarea
            id="TotalProteinComments"
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"  // Reduced height
          />
        </div>
      </div>
      <div className="col-span-1">
        <label htmlFor="Albumin" className="block text-sm font-medium text-gray-700">
          Albumin (Serum )
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="Albumin"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="AlbuminUnit" className="block text-sm font-medium text-gray-700">
          Unit (in mg/dL)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="AlbuminUnit"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="AlbuminReferenceRange" className="block text-sm font-medium text-gray-700">
          Reference Range
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="AlbuminReferenceRange"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="AlbuminComments" className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <div className="mt-1">
          <textarea
            id="AlbuminComments"
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"  // Reduced height
          />
        </div>
      </div>
      <div className="col-span-1">
        <label htmlFor="Globulin" className="block text-sm font-medium text-gray-700">
          Globulin(Serum)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="Globulin"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="GlobulinUnit" className="block text-sm font-medium text-gray-700">
          Unit (in %)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="GlobulinUnit"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="GlobulinReferenceRange" className="block text-sm font-medium text-gray-700">
          Reference Range
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="GlobulinReferenceRange"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="GlobulinComments" className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <div className="mt-1">
          <textarea
            id="GlobulinComments"
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"  // Reduced height
          />
        </div>
      </div>
      <div className="col-span-1">
        <label htmlFor="AlbGlobRatio" className="block text-sm font-medium text-gray-700">
          Alb/Glob Ratio
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="AlbGlobRatio"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="AlbGlobRatioUnit" className="block text-sm font-medium text-gray-700">
          Unit (in %)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="AlbGlobRatioUnit"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="AlbGlobRatioReferenceRange" className="block text-sm font-medium text-gray-700">
          Reference Range
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="AlbGlobRatioReferenceRange"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="AlbGlobRatioComments" className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <div className="mt-1">
          <textarea
            id="AlbGlobRatioComments"
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"  // Reduced height
          />
        </div>
      </div>
      <div className="col-span-1">
        <label htmlFor="GGT" className="block text-sm font-medium text-gray-700">
          Gamma Glutamyl transferase
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="GGT"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="GGTUnit" className="block text-sm font-medium text-gray-700">
          Unit (in %)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="GGTUnit"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="GGTReferenceRange" className="block text-sm font-medium text-gray-700">
          Reference Range
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="GGTReferenceRange"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="GGTComments" className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <div className="mt-1">
          <textarea
            id="GGTComments"
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"  // Reduced height
          />
        </div>
      </div>
    </div>
        {/* Add Data Button */}
        <div className="flex justify-end mt-4">
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => {
              // Add your logic to handle adding data here
              console.log("Add Data button clicked!");

              // BilirubinTotal
              const bilirubinTotalResult = document.getElementById("BilirubinTotal").value;
              const bilirubinTotalUnit = document.getElementById("BilirubinTotalUnit").value;
              const bilirubinTotalRefRange = document.getElementById("BilirubinTotalReferenceRange").value;
              const bilirubinTotalComments = document.getElementById("BilirubinTotalComments").value;

              // BilirubinDirect
              const bilirubinDirectResult = document.getElementById("BilirubinDirect").value;
              const bilirubinDirectUnit = document.getElementById("BilirubinDirectUnit").value;
              const bilirubinDirectRefRange = document.getElementById("BilirubinDirectReferenceRange").value;
              const bilirubinDirectComments = document.getElementById("BilirubinDirectComments").value;

              // BilirubinIndirect
              const bilirubinIndirectResult = document.getElementById("BilirubinIndirect").value;
              const bilirubinIndirectUnit = document.getElementById("BilirubinIndirectUnit").value;
              const bilirubinIndirectRefRange = document.getElementById("BilirubinIndirectReferenceRange").value;
              const bilirubinIndirectComments = document.getElementById("BilirubinIndirectComments").value;

              //SGOT
              const sGOTResult = document.getElementById("SGOT").value;
              const sGOTUnit = document.getElementById("SGOTUnit").value;
              const sGOTRefRange = document.getElementById("SGOTReferenceRange").value;
              const sGOTComments = document.getElementById("SGOTComments").value;

               //SGPT
               const sGPTResult = document.getElementById("SGPT").value;
               const sGPTUnit = document.getElementById("SGPTUnit").value;
               const sGPTRefRange = document.getElementById("SGPTReferenceRange").value;
               const sGPTComments = document.getElementById("SGPTComments").value;

              //AlkalinePhosphatase
              const alkalinePhosphataseResult = document.getElementById("AlkalinePhosphatase").value;
              const alkalinePhosphataseUnit = document.getElementById("AlkalinePhosphataseUnit").value;
              const alkalinePhosphataseRefRange = document.getElementById("AlkalinePhosphataseReferenceRange").value;
              const alkalinePhosphataseComments = document.getElementById("AlkalinePhosphataseComments").value;

              //TotalProtein
              const totalProteinResult = document.getElementById("TotalProtein").value;
              const totalProteinUnit = document.getElementById("TotalProteinUnit").value;
              const totalProteinRefRange = document.getElementById("TotalProteinReferenceRange").value;
              const totalProteinComments = document.getElementById("TotalProteinComments").value;

              //Albumin
              const albuminResult = document.getElementById("Albumin").value;
              const albuminUnit = document.getElementById("AlbuminUnit").value;
              const albuminRefRange = document.getElementById("AlbuminReferenceRange").value;
              const albuminComments = document.getElementById("AlbuminComments").value;

              //Globulin
              const globulinResult = document.getElementById("Globulin").value;
              const globulinUnit = document.getElementById("GlobulinUnit").value;
              const globulinRefRange = document.getElementById("GlobulinReferenceRange").value;
              const globulinComments = document.getElementById("GlobulinComments").value;

              //AlbGlobRatio
              const albGlobRatioResult = document.getElementById("AlbGlobRatio").value;
              const albGlobRatioUnit = document.getElementById("AlbGlobRatioUnit").value;
              const albGlobRatioRefRange = document.getElementById("AlbGlobRatioReferenceRange").value;
              const albGlobRatioComments = document.getElementById("AlbGlobRatioComments").value;

               //GGT
               const gGTResult = document.getElementById("GGT").value;
               const gGTUnit = document.getElementById("GGTUnit").value;
               const gGTRefRange = document.getElementById("GGTReferenceRange").value;
               const gGTComments = document.getElementById("GGTComments").value;

              console.log({
                bilirubinTotalResult,
                bilirubinTotalUnit,
                bilirubinTotalRefRange,
                bilirubinTotalComments,
                bilirubinDirectResult,
                bilirubinDirectUnit,
                bilirubinDirectRefRange,
                bilirubinDirectComments,
                bilirubinIndirectResult,
                bilirubinIndirectUnit,
                bilirubinIndirectRefRange,
                bilirubinIndirectComments,
                sGOTResult,
                sGOTUnit,
                sGOTRefRange,
                sGOTComments,
                sGPTResult,
                sGPTUnit,
                sGPTRefRange,
                sGPTComments,
                alkalinePhosphataseResult,
                alkalinePhosphataseUnit,
                alkalinePhosphataseRefRange,
                alkalinePhosphataseComments,
                totalProteinResult,
                totalProteinUnit,
                totalProteinRefRange,
                totalProteinComments,
                albuminResult,
                albuminUnit,
                albuminRefRange,
                albuminComments,
                globulinResult,
                globulinUnit,
                globulinRefRange,
                globulinComments,
                albGlobRatioResult,
                albGlobRatioUnit,
                albGlobRatioRefRange,
                albGlobRatioComments,
                gGTResult,
                gGTUnit,
                gGTRefRange,
                gGTComments,
              });
            }}
          >
            Add Data
          </button>
        </div>
  </div>
)}

      {selectedOption === "THYROID FUNCTION TEST" && (
  <div>
    <h3 className="text-lg font-medium">THYROID FUNCTION TEST</h3>
    {/* Add specific input fields for this option */}
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-1">
        <label htmlFor="T3" className="block text-sm font-medium text-gray-700">
          T3- Triiodothyroine
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="T3" //Shortened ID
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="T3Unit" className="block text-sm font-medium text-gray-700">
          Unit (in %)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="T3Unit" //Shortened ID
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="T3ReferenceRange" className="block text-sm font-medium text-gray-700">
          Reference Range
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="T3ReferenceRange" //Shortened ID
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="T3Comments" className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <div className="mt-1">
          <textarea
            id="T3Comments" //Shortened ID
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"  // Reduced height
          />
        </div>
      </div>
      <div className="col-span-1">
        <label htmlFor="T4" className="block text-sm font-medium text-gray-700">
          T4 - Thyroxine
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="T4" //Shortened ID
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="T4Unit" className="block text-sm font-medium text-gray-700">
          Unit (in %)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="T4Unit" //Shortened ID
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="T4ReferenceRange" className="block text-sm font-medium text-gray-700">
          Reference Range
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="T4ReferenceRange" //Shortened ID
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="T4Comments" className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <div className="mt-1">
          <textarea
            id="T4Comments" //Shortened ID
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"  // Reduced height
          />
        </div>
      </div>
      <div className="col-span-1">
        <label htmlFor="TSH" className="block text-sm font-medium text-gray-700">
          TSH- Thyroid Stimulating Hormone
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="TSH" //Shortened ID
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="TSHUnit" className="block text-sm font-medium text-gray-700">
          Unit (in %)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="TSHUnit" //Shortened ID
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="TSHReferenceRange" className="block text-sm font-medium text-gray-700">
          Reference Range
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="TSHReferenceRange" //Shortened ID
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="TSHComments" className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <div className="mt-1">
          <textarea
            id="TSHComments" //Shortened ID
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"  // Reduced height
          />
        </div>
      </div>
    </div>
      {/* Add Data Button */}
      <div className="flex justify-end mt-4">
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() => {
            // Add your logic to handle adding data here
            console.log("Add Data button clicked!");

            // T3
            const t3Result = document.getElementById("T3").value;
            const t3Unit = document.getElementById("T3Unit").value;
            const t3RefRange = document.getElementById("T3ReferenceRange").value;
            const t3Comments = document.getElementById("T3Comments").value;

            // T4
            const t4Result = document.getElementById("T4").value;
            const t4Unit = document.getElementById("T4Unit").value;
            const t4RefRange = document.getElementById("T4ReferenceRange").value;
            const t4Comments = document.getElementById("T4Comments").value;

            // TSH
            const tSHResult = document.getElementById("TSH").value;
            const tSHUnit = document.getElementById("TSHUnit").value;
            const tSHRefRange = document.getElementById("TSHReferenceRange").value;
            const tSHComments = document.getElementById("TSHComments").value;


            console.log({
              t3Result,
              t3Unit,
              t3RefRange,
              t3Comments,
              t4Result,
              t4Unit,
              t4RefRange,
              t4Comments,
              tSHResult,
              tSHUnit,
              tSHRefRange,
              tSHComments
            });
          }}
        >
          Add Data
        </button>
      </div>
  </div>
)}

       {selectedOption === "COAGULATION TEST" && (
  <div>
    <h3 className="text-lg font-medium">COAGULATION TEST</h3>
    {/* Add specific input fields for this option */}
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-1">
        <label htmlFor="ProthrombinTime" className="block text-sm font-medium text-gray-700">
          Prothrombin Time (PT)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="ProthrombinTime"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="ProthrombinTimeUnit" className="block text-sm font-medium text-gray-700">
          Unit (in %)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="ProthrombinTimeUnit"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="ProthrombinTimeReferenceRange" className="block text-sm font-medium text-gray-700">
          Reference Range
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="ProthrombinTimeReferenceRange"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="ProthrombinTimeComments" className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <div className="mt-1">
          <textarea
            id="ProthrombinTimeComments"
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"  // Reduced height
          />
        </div>
      </div>
      <div className="col-span-1">
        <label htmlFor="PTINR" className="block text-sm font-medium text-gray-700">
          PT INR
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="PTINR"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="PTINRUnit" className="block text-sm font-medium text-gray-700">
          Unit (in %)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="PTINRUnit"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="PTINRReferenceRange" className="block text-sm font-medium text-gray-700">
          Reference Range
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="PTINRReferenceRange"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="PTINRComments" className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <div className="mt-1">
          <textarea
            id="PTINRComments"
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
          />
        </div>
      </div>
      <div className="col-span-1">
        <label htmlFor="ClottingTime" className="block text-sm font-medium text-gray-700">
          Clotting Time (CT)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="ClottingTime"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="ClottingTimeUnit" className="block text-sm font-medium text-gray-700">
          Unit (in %)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="ClottingTimeUnit"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="ClottingTimeReferenceRange" className="block text-sm font-medium text-gray-700">
          Reference Range
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="ClottingTimeReferenceRange"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="ClottingTimeComments" className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <div className="mt-1">
          <textarea
            id="ClottingTimeComments"
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
          />
        </div>
      </div>
      <div className="col-span-1">
        <label htmlFor="BleedingTime" className="block text-sm font-medium text-gray-700">
          Bleeding Time (BT)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="BleedingTime"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="BleedingTimeUnit" className="block text-sm font-medium text-gray-700">
          Unit (in %)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="BleedingTimeUnit"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="BleedingTimeReferenceRange" className="block text-sm font-medium text-gray-700">
          Reference Range
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="BleedingTimeReferenceRange"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="BleedingTimeComments" className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <div className="mt-1">
          <textarea
            id="BleedingTimeComments"
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
          />
        </div>
      </div>
    </div>
    {/* Add Data Button */}
    <div className="flex justify-end mt-4">
      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={() => {
          // Add your logic to handle adding data here
          console.log("Add Data button clicked!");

          // ProthrombinTime
          const prothrombinTimeResult = document.getElementById("ProthrombinTime").value;
          const prothrombinTimeUnit = document.getElementById("ProthrombinTimeUnit").value;
          const prothrombinTimeRefRange = document.getElementById("ProthrombinTimeReferenceRange").value;
          const prothrombinTimeComments = document.getElementById("ProthrombinTimeComments").value;

          // PTINR
          const ptINRResult = document.getElementById("PTINR").value;
          const ptINRUnit = document.getElementById("PTINRUnit").value;
          const ptINRRefRange = document.getElementById("PTINRReferenceRange").value;
          const ptINRComments = document.getElementById("PTINRComments").value;

          // ClottingTime
          const clottingTimeResult = document.getElementById("ClottingTime").value;
          const clottingTimeUnit = document.getElementById("ClottingTimeUnit").value;
          const clottingTimeRefRange = document.getElementById("ClottingTimeReferenceRange").value;
          const clottingTimeComments = document.getElementById("ClottingTimeComments").value;

          // BleedingTime
          const bleedingTimeResult = document.getElementById("BleedingTime").value;
          const bleedingTimeUnit = document.getElementById("BleedingTimeUnit").value;
          const bleedingTimeRefRange = document.getElementById("BleedingTimeReferenceRange").value;
          const bleedingTimeComments = document.getElementById("BleedingTimeComments").value;


          console.log({
            prothrombinTimeResult,
            prothrombinTimeUnit,
            prothrombinTimeRefRange,
            prothrombinTimeComments,
            ptINRResult,
            ptINRUnit,
            ptINRRefRange,
            ptINRComments,
            clottingTimeResult,
            clottingTimeUnit,
            clottingTimeRefRange,
            clottingTimeComments,
            bleedingTimeResult,
            bleedingTimeUnit,
            bleedingTimeRefRange,
            bleedingTimeComments
          });
        }}
      >
        Add Data
      </button>
    </div>
  </div>
)}


      {selectedOption === "ENZYMES & CARDIAC Profile" && (
  <div>
    <h3 className="text-lg font-medium">ENZYMES & CARDIAC Profile</h3>
    {/* Add specific input fields for this option */}
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-1">
        <label htmlFor="AcidPhosphatase" className="block text-sm font-medium text-gray-700">
          Acid Phosphatase
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="AcidPhosphatase"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="AcidPhosphataseUnit" className="block text-sm font-medium text-gray-700">
          Unit (in %)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="AcidPhosphataseUnit"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="AcidPhosphataseReferenceRange" className="block text-sm font-medium text-gray-700">
          Reference Range
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="AcidPhosphataseReferenceRange"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="AcidPhosphataseComments" className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <div className="mt-1">
          <textarea
            id="AcidPhosphataseComments"
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
          />
        </div>
      </div>
      <div className="col-span-1">
        <label htmlFor="AdenosineDeaminase" className="block text-sm font-medium text-gray-700">
          Adenosine Deaminase
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="AdenosineDeaminase"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="AdenosineDeaminaseUnit" className="block text-sm font-medium text-gray-700">
          Unit (in %)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="AdenosineDeaminaseUnit"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="AdenosineDeaminaseReferenceRange" className="block text-sm font-medium text-gray-700">
          Reference Range
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="AdenosineDeaminaseReferenceRange"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="AdenosineDeaminaseComments" className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <div className="mt-1">
          <textarea
            id="AdenosineDeaminaseComments"
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
          />
        </div>
      </div>
      <div className="col-span-1">
        <label htmlFor="ECG" className="block text-sm font-medium text-gray-700">
          ECG
        </label>
        <select
          id="ECG" // Unique ID
          name="ECG" //Unique Name
          className="py-4 mt-1 block w-full rounded-md border-gray-300 bg-blue-100 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Normal">Normal</option>
          <option value="Abnormal">Abnormal</option>
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
          />
        </div>
      </div>
      <div className="col-span-1">
        <label htmlFor="TroponinT" className="block text-sm font-medium text-gray-700">
          Troponin- T
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="TroponinT"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="TroponinTUnit" className="block text-sm font-medium text-gray-700">
          Unit (in %)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="TroponinTUnit"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="TroponinTReferenceRange" className="block text-sm font-medium text-gray-700">
          Reference Range
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="TroponinTReferenceRange"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="TroponinTComments" className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <div className="mt-1">
          <textarea
            id="TroponinTComments"
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
          />
        </div>
      </div>
      <div className="col-span-1">
        <label htmlFor="CPKTotal" className="block text-sm font-medium text-gray-700">
          CPK - TOTAL
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="CPKTotal"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="CPKTotalUnit" className="block text-sm font-medium text-gray-700">
          Unit (in %)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="CPKTotalUnit"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="CPKTotalReferenceRange" className="block text-sm font-medium text-gray-700">
          Reference Range
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="CPKTotalReferenceRange"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="CPKTotalComments" className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <div className="mt-1">
          <textarea
            id="CPKTotalComments"
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
          />
        </div>
      </div>
      <div className="col-span-1">
        <label htmlFor="ECHO" className="block text-sm font-medium text-gray-700">
          ECHO
        </label>
        <select
          id="ECHO" //Unique ID
          name = "ECHO" // Unique Name
          className="py-4 mt-1 block w-full rounded-md border-gray-300 bg-blue-100 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Normal">Normal</option>
          <option value="Abnormal">Abnormal</option>
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
          />
        </div>
      </div>
      <div className="col-span-1">
        <label htmlFor="CPKMB" className="block text-sm font-medium text-gray-700">
          CPK - MB
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="CPKMB"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="CPKMBUnit" className="block text-sm font-medium text-gray-700">
          Unit (in %)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="CPKMBUnit"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="CPKMBReferenceRange" className="block text-sm font-medium text-gray-700">
          Reference Range
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="CPKMBReferenceRange"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="CPKMBComments" className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <div className="mt-1">
          <textarea
            id="CPKMBComments"
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
          />
        </div>
      </div>
      <div className="col-span-1">
        <label htmlFor="TMT" className="block text-sm font-medium text-gray-700">
          TMT
        </label>
        <select
          id="TMT" //Unique ID
          name = "TMT" // Unique Name
          className="py-4 mt-1 block w-full rounded-md border-gray-300 bg-blue-100 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Normal">Normal</option>
          <option value="Abnormal">Abnormal</option>
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
          />
        </div>
      </div>
    </div>
              {/* Add Data Button */}
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => {
                    // Add your logic to handle adding data here
                    console.log("Add Data button clicked!");

                    // AcidPhosphatase
                    const acidPhosphataseResult = document.getElementById("AcidPhosphatase").value;
                    const acidPhosphataseUnit = document.getElementById("AcidPhosphataseUnit").value;
                    const acidPhosphataseRefRange = document.getElementById("AcidPhosphataseReferenceRange").value;
                    const acidPhosphataseComments = document.getElementById("AcidPhosphataseComments").value;

                    // AdenosineDeaminase
                    const adenosineDeaminaseResult = document.getElementById("AdenosineDeaminase").value;
                    const adenosineDeaminaseUnit = document.getElementById("AdenosineDeaminaseUnit").value;
                    const adenosineDeaminaseRefRange = document.getElementById("AdenosineDeaminaseReferenceRange").value;
                    const adenosineDeaminaseComments = document.getElementById("AdenosineDeaminaseComments").value;

                    // Amylase
                    const amylaseResult = document.getElementById("Amylase").value;
                    const amylaseUnit = document.getElementById("AmylaseUnit").value;
                    const amylaseRefRange = document.getElementById("AmylaseReferenceRange").value;
                    const amylaseComments = document.getElementById("AmylaseComments").value;

                    //ECG
                    const eCGResult = document.getElementById("ECG").value;
                    const eCGUnit = document.getElementById("ECGUnit").value;
                    const eCGRefRange = document.getElementById("ECGReferenceRange").value;
                    const eCGComments = document.getElementById("ECGComments").value;

                    //TroponinT
                    const troponinTResult = document.getElementById("TroponinT").value;
                    const troponinTUnit = document.getElementById("TroponinTUnit").value;
                    const troponinTRefRange = document.getElementById("TroponinTReferenceRange").value;
                    const troponinTComments = document.getElementById("TroponinTComments").value;

                    //CPKTotal
                    const cPKTotalResult = document.getElementById("CPKTotal").value;
                    const cPKTotalUnit = document.getElementById("CPKTotalUnit").value;
                    const cPKTotalRefRange = document.getElementById("CPKTotalReferenceRange").value;
                    const cPKTotalComments = document.getElementById("CPKTotalComments").value;

                    //ECHO
                    const eCHOResult = document.getElementById("ECHO").value;
                    const eCHOUnit = document.getElementById("ECHOUnit").value;
                    const eCHORefRange = document.getElementById("ECHOReferenceRange").value;
                    const eCHOComments = document.getElementById("ECHOComments").value;

                    //Lipase
                    const lipaseResult = document.getElementById("Lipase").value;
                    const lipaseUnit = document.getElementById("LipaseUnit").value;
                    const lipaseRefRange = document.getElementById("LipaseReferenceRange").value;
                    const lipaseComments = document.getElementById("LipaseComments").value;

                    //CPKMB
                    const cPKMBResult = document.getElementById("CPKMB").value;
                    const cPKMBUnit = document.getElementById("CPKMBUnit").value;
                    const cPKMBRefRange = document.getElementById("CPKMBReferenceRange").value;
                    const cPKMBComments = document.getElementById("CPKMBComments").value;

                    //TMT
                    const tMTResult = document.getElementById("TMT").value;
                    const tMTUnit = document.getElementById("TMTUnit").value;
                    const tMTRefRange = document.getElementById("TMTReferenceRange").value;
                    const tMTComments = document.getElementById("TMTComments").value;

                    console.log({
                      acidPhosphataseResult,
                      acidPhosphataseUnit,
                      acidPhosphataseRefRange,
                      acidPhosphataseComments,
                      adenosineDeaminaseResult,
                      adenosineDeaminaseUnit,
                      adenosineDeaminaseRefRange,
                      adenosineDeaminaseComments,
                      amylaseResult,
                      amylaseUnit,
                      amylaseRefRange,
                      amylaseComments,
                      eCGResult,
                      eCGUnit,
                      eCGRefRange,
                      eCGComments,
                      troponinTResult,
                      troponinTUnit,
                      troponinTRefRange,
                      troponinTComments,
                      cPKTotalResult,
                      cPKTotalUnit,
                      cPKTotalRefRange,
                      cPKTotalComments,
                      eCHOResult,
                      eCHOUnit,
                      eCHORefRange,
                      eCHOComments,
                      lipaseResult,
                      lipaseUnit,
                      lipaseRefRange,
                      lipaseComments,
                      cPKMBResult,
                      cPKMBUnit,
                      cPKMBRefRange,
                      cPKMBComments,
                      tMTResult,
                      tMTUnit,
                      tMTRefRange,
                      tMTComments,
                    });
                  }}
                >
                  Add Data
                </button>
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3  block w-full rounded-md border-gray-300 bg-blue-100 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
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
                  className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12 h-12"
                />
              </div>
            </div>
            
          </div>
          <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => {
                    
                    console.log("Add Data button clicked!");

                    
                    const colourResult = document.getElementById("Colour").value;
                    const colourUnit = document.getElementById("ColourUnit").value;
                    const colourRefRange = document.getElementById("ColourReferenceRange").value;
                    const colourComments = document.getElementById("ColourComments").value;

                   
                    const appearanceResult = document.getElementById("Appearance").value;
                    const appearanceUnit = document.getElementById("AppearanceUnit").value;
                    const appearanceRefRange = document.getElementById("AppearanceReferenceRange").value;
                    const appearanceComments = document.getElementById("AppearanceComments").value;

                    
                    const reactionResult = document.getElementById("Reaction").value;
                    const reactionUnit = document.getElementById("ReactionUnit").value;
                    const reactionRefRange = document.getElementById("ReactionReferenceRange").value;
                    const reactionComments = document.getElementById("ReactionComments").value;

                   
                    const specificgravityResult = document.getElementById("Specific_gravity").value;
                    const specificgravityUnit = document.getElementById("Specific_gravityUnit").value;
                    const specificgravityRefRange = document.getElementById("Specific_gravityReferenceRange").value;
                    const specificgravityComments = document.getElementById("Specific_gravityComments").value;

                    
                    const crystalsResult = document.getElementById("Crystals").value;
                    const crystalsUnit = document.getElementById("CrystalsUnit").value;
                    const crystalsRefRange = document.getElementById("CrystalsReferenceRange").value;
                    const crystalsComments = document.getElementById("CrystalsComments").value;

                  
                    const bacteriaResult = document.getElementById("Bacteria").value;
                    const bacteriaUnit = document.getElementById("BacteriaUnit").value;
                    const bacteriaRefRange = document.getElementById("BacteriaReferenceRange").value;
                    const bacteriaComments = document.getElementById("BacteriaComments").value;

                    const proteinResult = document.getElementById("Protein").value;
                    const proteinUnit = document.getElementById("ProteinUnit").value;
                    const proteinRefRange = document.getElementById("ProteinReferenceRange").value;
                    const proteinComments = document.getElementById("ProteinComments").value;

                    
                    const glucoseResult = document.getElementById("Glucose").value;
                    const glucoseUnit = document.getElementById("GlucoseUnit").value;
                    const glucoseRefRange = document.getElementById("GlucoseReferenceRange").value;
                    const glucoseComments = document.getElementById("GlucoseComments").value;

                  
                    const ketoneBodiesResult = document.getElementById("KetoneBodies").value;
                    const ketoneBodiesUnit = document.getElementById("KetoneBodiesUnit").value;
                    const ketoneBodiesRefRange = document.getElementById("KetoneBodiesReferenceRange").value;
                    const ketoneBodiesComments = document.getElementById("KetoneBodiesComments").value;

                   
                    const urobilinogenResult = document.getElementById("Urobilinogen").value;
                    const urobilinogenUnit = document.getElementById("UrobilinogenUnit").value;
                    const urobilinogenRefRange = document.getElementById("UrobilinogenReferenceRange").value;
                    const urobilinogenComments = document.getElementById("UrobilinogenComments").value;

                    const castsResult = document.getElementById("Casts").value;
                    const castsUnit = document.getElementById("CastsUnit").value;
                    const castsRefRange = document.getElementById("CastsReferenceRange").value;
                    const castsComments = document.getElementById("CastsComments").value;
                    
                    const bileSaltsResult = document.getElementById("BileSalts").value;
                    const bileSaltsUnit = document.getElementById("BileSaltsUnit").value;
                    const bileSaltsRefRange = document.getElementById("BileSaltsReferenceRange").value;
                    const bileSaltsComments = document.getElementById("BileSaltsComments").value;

                    const bilePigmentsResult = document.getElementById("BilePigments").value;
                    const bilePigmentsUnit = document.getElementById("BilePigmentsUnit").value;
                    const bilePigmentsRefRange = document.getElementById("BilePigmentsReferenceRange").value;
                    const bilePigmentsComments = document.getElementById("BilePigmentsComments").value;

                    const WBCResult = document.getElementById("WBC").value;
                    const WBCUnit = document.getElementById("WBCUnit").value;
                    const WBCRefRange = document.getElementById("WBCReferenceRange").value;
                    const WBCComments = document.getElementById("WBCComments").value;

                    const redBloodCellsResult = document.getElementById("RedBloodCells").value;
                    const redBloodCellsUnit = document.getElementById("RedBloodCellsUnit").value;
                    const redBloodCellsRefRange = document.getElementById("RedBloodCellsReferenceRange").value;
                    const redBloodCellsComments = document.getElementById("RedBloodCellsComments").value;

                    const epithelialcellsResult = document.getElementById("Epithelialcells").value;
                    const epithelialcellsUnit = document.getElementById("EpithelialcellsUnit").value;
                    const epithelialcellsRefRange = document.getElementById("EpithelialcellsReferenceRange").value;
                    const epithelialcellsComments = document.getElementById("EpithelialcellsComments").value;

                    console.log({
                      colourResult,
                      colourUnit,
                      colourRefRange,
                      colourComments,
                    
                      appearanceResult,
                      appearanceUnit,
                      appearanceRefRange,
                      appearanceComments,
                    
                      reactionResult,
                      reactionUnit,
                      reactionRefRange,
                      reactionComments,
                    
                      specificgravityResult,
                      specificgravityUnit,
                      specificgravityRefRange,
                      specificgravityComments,
                    
                      crystalsResult,
                      crystalsUnit,
                      crystalsRefRange,
                      crystalsComments,
                    
                      bacteriaResult,
                      bacteriaUnit,
                      bacteriaRefRange,
                      bacteriaComments,
                    
                      proteinResult,
                      proteinUnit,
                      proteinRefRange,
                      proteinComments,
                    
                      glucoseResult,
                      glucoseUnit,
                      glucoseRefRange,
                      glucoseComments,
                    
                      ketoneBodiesResult,
                      ketoneBodiesUnit,
                      ketoneBodiesRefRange,
                      ketoneBodiesComments,
                    
                      urobilinogenResult,
                      urobilinogenUnit,
                      urobilinogenRefRange,
                      urobilinogenComments,
                    
                      castsResult,
                      castsUnit,
                      castsRefRange,
                      castsComments,
                    
                      bileSaltsResult,
                      bileSaltsUnit,
                      bileSaltsRefRange,
                      bileSaltsComments,
                    
                      bilePigmentsResult,
                      bilePigmentsUnit,
                      bilePigmentsRefRange,
                      bilePigmentsComments,
                    
                      WBCResult,
                      WBCUnit,
                      WBCRefRange,
                      WBCComments,
                    
                      redBloodCellsResult,
                      redBloodCellsUnit,
                      redBloodCellsRefRange,
                      redBloodCellsComments,
                    
                      epithelialcellsResult,
                      epithelialcellsUnit,
                      epithelialcellsRefRange,
                      epithelialcellsComments,
                    });
                    
                  }}
                >
                  Add Data
                </button>
              </div>
        </div>
      )}

      {selectedOption === "SEROLOGY" && (
  <div>
    <h3 className="text-lg font-medium">SEROLOGY</h3>
    {/* Add specific input fields for this option */}
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-1">
        <label htmlFor="HIVScreening" className="block text-sm font-medium text-gray-700">
          Screening For HIV I & II
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="HIVScreening"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="HIVScreeningUnit" className="block text-sm font-medium text-gray-700">
          Unit (in mg/dL)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="HIVScreeningUnit"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="HIVScreeningReferenceRange" className="block text-sm font-medium text-gray-700">
          Reference Range
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="HIVScreeningReferenceRange"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="HIVScreeningComments" className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <div className="mt-1">
          <textarea
            id="HIVScreeningComments"
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
          />
        </div>
      </div>
      <div className="col-span-1">
        <label htmlFor="OccultBlood" className="block text-sm font-medium text-gray-700">
          Occult Blood
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="OccultBlood"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="OccultBloodUnit" className="block text-sm font-medium text-gray-700">
          Unit (in mg/dL)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="OccultBloodUnit"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="OccultBloodReferenceRange" className="block text-sm font-medium text-gray-700">
          Reference Range
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="OccultBloodReferenceRange"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="OccultBloodComments" className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <div className="mt-1">
          <textarea
            id="OccultBloodComments"
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
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
            id="Mucus"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
          />
        </div>
      </div>
      <div className="col-span-1">
        <label htmlFor="PusCells" className="block text-sm font-medium text-gray-700">
          Pus Cells
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="PusCells"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="PusCellsUnit" className="block text-sm font-medium text-gray-700">
          Unit (in mg/dL)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="PusCellsUnit"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="PusCellsReferenceRange" className="block text-sm font-medium text-gray-700">
          Reference Range
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="PusCellsReferenceRange"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="PusCellsComments" className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <div className="mt-1">
          <textarea
            id="PusCellsComments"
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
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
            id="RBCs"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
          />
        </div>
      </div>
    </div>
    {/* Add Data Button */}
    <div className="flex justify-end mt-4">
      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={() => {
          // Add your logic to handle adding data here
          console.log("Add Data button clicked!");

          //HIVScreening
          const hIVScreeningResult = document.getElementById("HIVScreening").value;
          const hIVScreeningUnit = document.getElementById("HIVScreeningUnit").value;
          const hIVScreeningRefRange = document.getElementById("HIVScreeningReferenceRange").value;
          const hIVScreeningComments = document.getElementById("HIVScreeningComments").value;

          //OccultBlood
          const occultBloodResult = document.getElementById("OccultBlood").value;
          const occultBloodUnit = document.getElementById("OccultBloodUnit").value;
          const occultBloodRefRange = document.getElementById("OccultBloodReferenceRange").value;
          const occultBloodComments = document.getElementById("OccultBloodComments").value;

          //Cyst
          const cystResult = document.getElementById("Cyst").value;
          const cystUnit = document.getElementById("CystUnit").value;
          const cystRefRange = document.getElementById("CystReferenceRange").value;
          const cystComments = document.getElementById("CystComments").value;

          //Mucus
          const mucusResult = document.getElementById("Mucus").value;
          const mucusUnit = document.getElementById("MucusUnit").value;
          const mucusRefRange = document.getElementById("MucusReferenceRange").value;
          const mucusComments = document.getElementById("MucusComments").value;

          //PusCells
          const pusCellsResult = document.getElementById("PusCells").value;
          const pusCellsUnit = document.getElementById("PusCellsUnit").value;
          const pusCellsRefRange = document.getElementById("PusCellsReferenceRange").value;
          const pusCellsComments = document.getElementById("PusCellsComments").value;

          //Ova
          const ovaResult = document.getElementById("Ova").value;
          const ovaUnit = document.getElementById("OvaUnit").value;
          const ovaRefRange = document.getElementById("OvaReferenceRange").value;
          const ovaComments = document.getElementById("OvaComments").value;

          //RBCs
          const rBCsResult = document.getElementById("RBCs").value;
          const rBCsUnit = document.getElementById("RBCsUnit").value;
          const rBCsRefRange = document.getElementById("RBCsReferenceRange").value;
          const rBCsComments = document.getElementById("RBCsComments").value;

          //Others
          const othersResult = document.getElementById("Others").value;
          const othersUnit = document.getElementById("OthersUnit").value;
          const othersRefRange = document.getElementById("OthersReferenceRange").value;
          const othersComments = document.getElementById("OthersComments").value;

          console.log({
            hIVScreeningResult,
            hIVScreeningUnit,
            hIVScreeningRefRange,
            hIVScreeningComments,
            occultBloodResult,
            occultBloodUnit,
            occultBloodRefRange,
            occultBloodComments,
            cystResult,
            cystUnit,
            cystRefRange,
            cystComments,
            mucusResult,
            mucusUnit,
            mucusRefRange,
            mucusComments,
            pusCellsResult,
            pusCellsUnit,
            pusCellsRefRange,
            pusCellsComments,
            ovaResult,
            ovaUnit,
            ovaRefRange,
            ovaComments,
            rBCsResult,
            rBCsUnit,
            rBCsRefRange,
            rBCsComments,
            othersResult,
            othersUnit,
            othersRefRange,
            othersComments,
          });
        }}
      >
        Add Data
      </button>
    </div>
  </div>
)}

{selectedOption === "MOTION" && (
  <div>
    <h3 className="text-lg font-medium">MOTION</h3>
    {/* Add specific input fields for this option */}
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-1">
        <label htmlFor="Colour" className="block text-sm font-medium text-gray-700">
          Colour (Motion)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="Colour"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
          />
        </div>
      </div>
      <div className="col-span-1">
        <label htmlFor="Appearance" className="block text-sm font-medium text-gray-700">
          Appearance (Motion)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="Appearance"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
          />
        </div>
      </div>
      <div className="col-span-1">
        <label htmlFor="OccultBlood" className="block text-sm font-medium text-gray-700">
          Occult Blood
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="OccultBlood"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="OccultBloodUnit" className="block text-sm font-medium text-gray-700">
          Unit (in mg/dL)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="OccultBloodUnit"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="OccultBloodReferenceRange" className="block text-sm font-medium text-gray-700">
          Reference Range
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="OccultBloodReferenceRange"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="OccultBloodComments" className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <div className="mt-1">
          <textarea
            id="OccultBloodComments"
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
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
            id="Mucus"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
          />
        </div>
      </div>
      <div className="col-span-1">
        <label htmlFor="PusCells" className="block text-sm font-medium text-gray-700">
          Pus Cells
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="PusCells"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="PusCellsUnit" className="block text-sm font-medium text-gray-700">
          Unit (in mg/dL)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="PusCellsUnit"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="PusCellsReferenceRange" className="block text-sm font-medium text-gray-700">
          Reference Range
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="PusCellsReferenceRange"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="PusCellsComments" className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <div className="mt-1">
          <textarea
            id="PusCellsComments"
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
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
            id="RBCs"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
          />
        </div>
      </div>
    </div>
     {/* Add Data Button */}
     <div className="flex justify-end mt-4">
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() => {
            // Add your logic to handle adding data here
            console.log("Add Data button clicked!");

            //Color
            const colorResult = document.getElementById("Colour").value;
            const colorUnit = document.getElementById("ColourUnit").value;
            const colorRefRange = document.getElementById("ColourReferenceRange").value;
            const colorComments = document.getElementById("ColourComments").value;

            //Appearance
            const appearanceResult = document.getElementById("Appearance").value;
            const appearanceUnit = document.getElementById("AppearanceUnit").value;
            const appearanceRefRange = document.getElementById("AppearanceReferenceRange").value;
            const appearanceComments = document.getElementById("AppearanceComments").value;

            //Occult Blood
            const occultBloodResult = document.getElementById("OccultBlood").value;
            const occultBloodUnit = document.getElementById("OccultBloodUnit").value;
            const occultBloodRefRange = document.getElementById("OccultBloodReferenceRange").value;
            const occultBloodComments = document.getElementById("OccultBloodComments").value;

            //Cyst
            const cystResult = document.getElementById("Cyst").value;
            const cystUnit = document.getElementById("CystUnit").value;
            const cystRefRange = document.getElementById("CystReferenceRange").value;
            const cystComments = document.getElementById("CystComments").value;

             //Mucus
             const mucusResult = document.getElementById("Mucus").value;
             const mucusUnit = document.getElementById("MucusUnit").value;
             const mucusRefRange = document.getElementById("MucusReferenceRange").value;
             const mucusComments = document.getElementById("MucusComments").value;

            //PusCells
            const pusCellsResult = document.getElementById("PusCells").value;
            const pusCellsUnit = document.getElementById("PusCellsUnit").value;
            const pusCellsRefRange = document.getElementById("PusCellsReferenceRange").value;
            const pusCellsComments = document.getElementById("PusCellsComments").value;

            //Ova
            const ovaResult = document.getElementById("Ova").value;
            const ovaUnit = document.getElementById("OvaUnit").value;
            const ovaRefRange = document.getElementById("OvaReferenceRange").value;
            const ovaComments = document.getElementById("OvaComments").value;

            //RBCs
            const rBCsResult = document.getElementById("RBCs").value;
            const rBCsUnit = document.getElementById("RBCsUnit").value;
            const rBCsRefRange = document.getElementById("RBCsReferenceRange").value;
            const rBCsComments = document.getElementById("RBCsComments").value;

            //Others
            const othersResult = document.getElementById("Others").value;
            const othersUnit = document.getElementById("OthersUnit").value;
            const othersRefRange = document.getElementById("OthersReferenceRange").value;
            const othersComments = document.getElementById("OthersComments").value;

            console.log({
              colorResult,
              colorUnit,
              colorRefRange,
              colorComments,
              appearanceResult,
              appearanceUnit,
              appearanceRefRange,
              appearanceComments,
              occultBloodResult,
              occultBloodUnit,
              occultBloodRefRange,
              occultBloodComments,
              cystResult,
              cystUnit,
              cystRefRange,
              cystComments,
              mucusResult,
              mucusUnit,
              mucusRefRange,
              mucusComments,
              pusCellsResult,
              pusCellsUnit,
              pusCellsRefRange,
              pusCellsComments,
              ovaResult,
              ovaUnit,
              ovaRefRange,
              ovaComments,
              rBCsResult,
              rBCsUnit,
              rBCsRefRange,
              rBCsComments,
              othersResult,
              othersUnit,
              othersRefRange,
              othersComments,
            });
          }}
        >
          Add Data
        </button>
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
          />
        </div>
      </div>
    </div>
    {/* Add Data Button */}
    <div className="flex justify-end mt-4">
      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={() => {
          // Add your logic to handle adding data here
          console.log("Add Data button clicked!");

          // Urine
          const urineResult = document.getElementById("Urine").value;
          const urineUnit = document.getElementById("UrineUnit").value;
          const urineRefRange = document.getElementById("UrineReferenceRange").value;
          const urineComments = document.getElementById("UrineComments").value;

          // Motion
          const motionResult = document.getElementById("Motion").value;
          const motionUnit = document.getElementById("MotionUnit").value;
          const motionRefRange = document.getElementById("MotionReferenceRange").value;
          const motionComments = document.getElementById("MotionComments").value;

          // Sputum
          const sputumResult = document.getElementById("Sputum").value;
          const sputumUnit = document.getElementById("SputumUnit").value;
          const sputumRefRange = document.getElementById("SputumReferenceRange").value;
          const sputumComments = document.getElementById("SputumComments").value;

          // Blood
          const bloodResult = document.getElementById("Blood").value;
          const bloodUnit = document.getElementById("BloodUnit").value;
          const bloodRefRange = document.getElementById("BloodReferenceRange").value;
          const bloodComments = document.getElementById("BloodComments").value;


          console.log({
            urineResult,
            urineUnit,
            urineRefRange,
            urineComments,
            motionResult,
            motionUnit,
            motionRefRange,
            motionComments,
            sputumResult,
            sputumUnit,
            sputumRefRange,
            sputumComments,
            bloodResult,
            bloodUnit,
            bloodRefRange,
            bloodComments,
          });
        }}
      >
        Add Data
      </button>
    </div>
  </div>
)}

       {selectedOption === "Men's Pack" && (
  <div>
    <h3 className="text-lg font-medium">Men's Pack</h3>
    {/* Add specific input fields for this option */}
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-1">
        <label htmlFor="PSA" className="block text-sm font-medium text-gray-700">
          PSA (Prostate specific Antigen)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="PSA" // Shortened ID for brevity and clarity
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="PSAUnit" className="block text-sm font-medium text-gray-700">
          Unit (in mg/dL)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="PSAUnit" // Shortened ID
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="PSAReferenceRange" className="block text-sm font-medium text-gray-700">
          Reference Range
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="PSAReferenceRange" // Shortened ID
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="PSAComments" className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <div className="mt-1">
          <textarea
            id="PSAComments" // Shortened ID
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
          />
        </div>
      </div>
    </div>
    {/* Add Data Button */}
    <div className="flex justify-end mt-4">
      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={() => {
          // Add your logic to handle adding data here
          console.log("Add Data button clicked!");

          // PSA
          const psaResult = document.getElementById("PSA").value;
          const psaUnit = document.getElementById("PSAUnit").value;
          const psaRefRange = document.getElementById("PSAReferenceRange").value;
          const psaComments = document.getElementById("PSAComments").value;

          console.log({
            psaResult,
            psaUnit,
            psaRefRange,
            psaComments,
          });
        }}
      >
        Add Data
      </button>
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
          id="Mammogram" // Unique and descriptive ID
          name="Mammogram" // Unique and descriptive name
          className="py-4 mt-1 block w-full rounded-md border-gray-300 bg-blue-100 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Normal">Normal</option>
          <option value="Abnormal">Abnormal</option>
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"  // Reduced height
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="PAP Smear" className="block text-sm font-medium text-gray-700">
          PAP Smear
        </label>
        <select
          id="PAP Smear" // Unique and descriptive ID
          name="PAP Smear" // Unique and descriptive name
          className="py-4 mt-1 block w-full rounded-md border-gray-300 bg-blue-100 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Normal">Normal</option>
          <option value="Abnormal">Abnormal</option>
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
          />
        </div>
      </div>
    </div>
                {/* Add Data Button */}
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => {
                      // Add your logic to handle adding data here
                      console.log("Add Data button clicked!");

                      // Mammogram
                      const mammogramResult = document.getElementById("Mammogram").value;
                      const mammogramUnit = document.getElementById("MammogramUnit").value;
                      const mammogramRefRange = document.getElementById("MammogramReferenceRange").value;
                      const mammogramComments = document.getElementById("MammogramComments").value;

                      // PAP Smear
                      const papSmearResult = document.getElementById("PAP Smear").value;
                      const papSmearUnit = document.getElementById("PAP SmearUnit").value;
                      const papSmearRefRange = document.getElementById("PAP SmearReferenceRange").value;
                      const papSmearComments = document.getElementById("PAP SmearComments").value;

                      console.log({
                        mammogramResult,
                        mammogramUnit,
                        mammogramRefRange,
                        mammogramComments,
                        papSmearResult,
                        papSmearUnit,
                        papSmearRefRange,
                        papSmearComments,
                      });
                    }}
                  >
                    Add Data
                  </button>
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
          id="Audiometry" // Unique and descriptive ID
          name="Audiometry" // Unique and descriptive name
          className="py-4 mt-1 block w-full rounded-md border-gray-300 bg-blue-100 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Normal">Normal</option>
          <option value="Abnormal">Abnormal</option>
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"  // Reduced height
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="PFT" className="block text-sm font-medium text-gray-700">
          PFT
        </label>
        <select
          id="PFT" // Unique and descriptive ID
          name="PFT" // Unique and descriptive name
          className="py-4 mt-1 block w-full rounded-md border-gray-300 bg-blue-100 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Normal">Normal</option>
          <option value="Abnormal">Abnormal</option>
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
          />
        </div>
      </div>
    </div>
    {/* Add Data Button */}
    <div className="flex justify-end mt-4">
      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={() => {
          // Add your logic to handle adding data here
          console.log("Add Data button clicked!");

          // Audiometry
          const audiometryResult = document.getElementById("Audiometry").value;
          const audiometryUnit = document.getElementById("AudiometryUnit").value;
          const audiometryRefRange = document.getElementById("AudiometryReferenceRange").value;
          const audiometryComments = document.getElementById("AudiometryComments").value;

          // PFT
          const pftResult = document.getElementById("PFT").value;
          const pftUnit = document.getElementById("PFTUnit").value;
          const pftRefRange = document.getElementById("PFTReferenceRange").value;
          const pftComments = document.getElementById("PFTComments").value;

          console.log({
            audiometryResult,
            audiometryUnit,
            audiometryRefRange,
            audiometryComments,
            pftResult,
            pftUnit,
            pftRefRange,
            pftComments,
          });
        }}
      >
        Add Data
      </button>
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
          id="Pathology" // Unique and descriptive ID
          name="Pathology" // Unique and descriptive name
          className="py-4 mt-1 block w-full rounded-md border-gray-300 bg-blue-100 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Normal">Normal</option>
          <option value="Abnormal">Abnormal</option>
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"  // Reduced height
          />
        </div>
      </div>
    </div>
        {/* Add Data Button */}
        <div className="flex justify-end mt-4">
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => {
              // Add your logic to handle adding data here
              console.log("Add Data button clicked!");

              // Pathology
              const pathologyResult = document.getElementById("Pathology").value;
              const pathologyUnit = document.getElementById("PathologyUnit").value;
              const pathologyRefRange = document.getElementById("PathologyReferenceRange").value;
              const pathologyComments = document.getElementById("PathologyComments").value;

              console.log({
                pathologyResult,
                pathologyUnit,
                pathologyRefRange,
                pathologyComments,
              });
            }}
          >
            Add Data
          </button>
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
          id="Vision" // Unique and descriptive ID
          name="Vision" // Unique and descriptive name
          className="py-4 mt-1 block w-full rounded-md border-gray-300 bg-blue-100 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Normal">Normal</option>
          <option value="Abnormal">Abnormal</option>
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="Color Vision" className="block text-sm font-medium text-gray-700">
          Color Vision
        </label>
        <select
          id="Color Vision" // Unique and descriptive ID
          name="Color Vision" // Unique and descriptive name
          className="py-4 mt-1 block w-full rounded-md border-gray-300 bg-blue-100 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Normal">Normal</option>
          <option value="Abnormal">Abnormal</option>
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
          />
        </div>
      </div>
    </div>
            {/* Add Data Button */}
            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => {
                  // Add your logic to handle adding data here
                  console.log("Add Data button clicked!");

                  // Vision
                  const visionResult = document.getElementById("Vision").value;
                  const visionUnit = document.getElementById("VisionUnit").value;
                  const visionRefRange = document.getElementById("VisionReferenceRange").value;
                  const visionComments = document.getElementById("VisionComments").value;

                  // Color Vision
                  const colorVisionResult = document.getElementById("Color Vision").value;
                  const colorVisionUnit = document.getElementById("Color VisionUnit").value;
                  const colorVisionRefRange = document.getElementById("Color VisionReferenceRange").value;
                  const colorVisionComments = document.getElementById("Color VisionComments").value;

                  console.log({
                    visionResult,
                    visionUnit,
                    visionRefRange,
                    visionComments,
                    colorVisionResult,
                    colorVisionUnit,
                    colorVisionRefRange,
                    colorVisionComments,
                  });
                }}
              >
                Add Data
              </button>
            </div>
  </div>
)}


       {selectedOption === "X-RAY" && (
  <div>
    <h3 className="text-lg font-medium">X-RAY</h3>
    {/* Add specific input fields for this option */}
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-1">
        <label htmlFor="X-RAY Chest" className="block text-sm font-medium text-gray-700">
          X-RAY Chest
        </label>
        <select
          id="X-RAY Chest"  // Unique and descriptive ID
          name="X-RAY Chest"  // Unique and descriptive name
          className="py-4 mt-1 block w-full rounded-md border-gray-300 bg-blue-100 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Normal">Normal</option>
          <option value="Abnormal">Abnormal</option>
        </select>
      </div>

      <div className="col-span-1">
        <label htmlFor="X-RAY ChestUnit" className="block text-sm font-medium text-gray-700">
          Unit (in mg/dL)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="X-RAY ChestUnit"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="X-RAY ChestReferenceRange" className="block text-sm font-medium text-gray-700">
          Reference Range
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="X-RAY ChestReferenceRange"
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="X-RAY ChestComments" className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <div className="mt-1">
          <textarea
            id="X-RAY ChestComments"
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"  // Reduced height
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="X-RAY KUB" className="block text-sm font-medium text-gray-700">
          X-RAY KUB
        </label>
        <select
          id="X-RAY KUB"  // Unique and descriptive ID
          name="X-RAY KUB"  // Unique and descriptive name
          className="py-4 mt-1 block w-full rounded-md border-gray-300 bg-blue-100 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Normal">Normal</option>
          <option value="Abnormal">Abnormal</option>
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="X-RAY Spine" className="block text-sm font-medium text-gray-700">
          X-RAY Spine
        </label>
        <select
          id="X-RAY Spine"  // Unique and descriptive ID
          name="X-RAY Spine"  // Unique and descriptive name
          className="py-4 mt-1 block w-full rounded-md border-gray-300 bg-blue-100 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Normal">Normal</option>
          <option value="Abnormal">Abnormal</option>
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"  // Reduced height
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="X-RAY Pelvis" className="block text-sm font-medium text-gray-700">
          X-RAY Pelvis
        </label>
        <select
          id="X-RAY Pelvis"  // Unique and descriptive ID
          name="X-RAY Pelvis"  // Unique and descriptive name
          className="py-4 mt-1 block w-full rounded-md border-gray-300 bg-blue-100 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Normal">Normal</option>
          <option value="Abnormal">Abnormal</option>
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"  // Reduced height
          />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="X-RAY Abdomen" className="block text-sm font-medium text-gray-700">
          X-RAY Abdomen
        </label>
        <select
          id="X-RAY Abdomen"  // Unique and descriptive ID
          name="X-RAY Abdomen"  // Unique and descriptive name
          className="py-4 mt-1 block w-full rounded-md border-gray-300 bg-blue-100 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Normal">Normal</option>
          <option value="Abnormal">Abnormal</option>
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
          />
        </div>
      </div>
    </div>

    {/* Add Data Button */}
    <div className="flex justify-end mt-4">
      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={() => {
          // Add your logic to handle adding data here
          console.log("Add Data button clicked!");

          // X-RAY Chest
          const xrayChestResult = document.getElementById("X-RAY Chest").value;
          const xrayChestUnit = document.getElementById("X-RAY ChestUnit").value;
          const xrayChestRefRange = document.getElementById("X-RAY ChestReferenceRange").value;
          const xrayChestComments = document.getElementById("X-RAY ChestComments").value;

          // X-RAY KUB
          const xrayKUBResult = document.getElementById("X-RAY KUB").value;
          const xrayKUBUnit = document.getElementById("X-RAY KUBUnit").value;
          const xrayKUBRefRange = document.getElementById("X-RAY KUBReferenceRange").value;
          const xrayKUBComments = document.getElementById("X-RAY KUBComments").value;

          // X-RAY Spine
          const xraySpineResult = document.getElementById("X-RAY Spine").value;
          const xraySpineUnit = document.getElementById("X-RAY SpineUnit").value;
          const xraySpineRefRange = document.getElementById("X-RAY SpineReferenceRange").value;
          const xraySpineComments = document.getElementById("X-RAY SpineComments").value;

          // X-RAY Pelvis
          const xrayPelvisResult = document.getElementById("X-RAY Pelvis").value;
          const xrayPelvisUnit = document.getElementById("X-RAY PelvisUnit").value;
          const xrayPelvisRefRange = document.getElementById("X-RAY PelvisReferenceRange").value;
          const xrayPelvisComments = document.getElementById("X-RAY PelvisComments").value;

          // X-RAY Abdomen
          const xrayAbdomenResult = document.getElementById("X-RAY Abdomen").value;
          const xrayAbdomenUnit = document.getElementById("X-RAY AbdomenUnit").value;
          const xrayAbdomenRefRange = document.getElementById("X-RAY AbdomenReferenceRange").value;
          const xrayAbdomenComments = document.getElementById("X-RAY AbdomenComments").value;


          console.log({
            xrayChestResult,
            xrayChestUnit,
            xrayChestRefRange,
            xrayChestComments,
            xrayKUBResult,
            xrayKUBUnit,
            xrayKUBRefRange,
            xrayKUBComments,
            xraySpineResult,
            xraySpineUnit,
            xraySpineRefRange,
            xraySpineComments,
            xrayPelvisResult,
            xrayPelvisUnit,
            xrayPelvisRefRange,
            xrayPelvisComments,
            xrayAbdomenResult,
            xrayAbdomenUnit,
            xrayAbdomenRefRange,
            xrayAbdomenComments
          });
        }}
      >
        Add Data
      </button>
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
          id="USG ABDOMEN" // Make sure the id is unique and descriptive
          name="USG ABDOMEN" // Make sure the name is unique and descriptive
          className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Normal">Normal</option>
          <option value="Abnormal">Abnormal</option>
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
          />
        </div>
      </div>
      <div className="col-span-1">
        <label htmlFor="USG KUB" className="block text-sm font-medium text-gray-700">
          USG KUB
        </label>
        <select
          id="USG KUB"  // Make sure the id is unique and descriptive
          name="USG KUB"  // Make sure the name is unique and descriptive
          className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Normal">Normal</option>
          <option value="Abnormal">Abnormal</option>
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
          />
        </div>
      </div>
      <div className="col-span-1">
        <label htmlFor="USG Pelvis" className="block text-sm font-medium text-gray-700">
          USG Pelvis
        </label>
        <select
            id="USG Pelvis"  // Make sure the id is unique and descriptive
            name="USG Pelvis"  // Make sure the name is unique and descriptive
          className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Normal">Normal</option>
          <option value="Abnormal">Abnormal</option>
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
          />
        </div>
      </div>
      <div className="col-span-1">
        <label htmlFor="USG Neck" className="block text-sm font-medium text-gray-700">
          USG Neck
        </label>
        <select
          id="USG Neck"  // Make sure the id is unique and descriptive
          name="USG Neck"  // Make sure the name is unique and descriptive
          className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Normal">Normal</option>
          <option value="Abnormal">Abnormal</option>
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height
          />
        </div>
      </div>
    </div>

    {/* Add Data Button */}
    <div className="flex justify-end mt-4"> {/* Added mt-4 for spacing */}
      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={() => {
          // Add your logic to handle adding data here
          console.log("Add Data button clicked!");

          // USG Abdomen
          const usgAbdomenResult = document.getElementById("USG ABDOMEN").value;
          const usgAbdomenUnit = document.getElementById("USG ABDOMENUnit").value;
          const usgAbdomenRefRange = document.getElementById("USG ABDOMENReferenceRange").value;
          const usgAbdomenComments = document.getElementById("USG ABDOMENComments").value;

          // USG KUB
          const usgKUBResult = document.getElementById("USG KUB").value;
          const usgKUBUnit = document.getElementById("USG KUBUnit").value;
          const usgKUBRefRange = document.getElementById("USG KUBReferenceRange").value;
          const usgKUBComments = document.getElementById("USG KUBComments").value;

          // USG Pelvis
          const usgPelvisResult = document.getElementById("USG Pelvis").value;
          const usgPelvisUnit = document.getElementById("USG PelvisUnit").value;
          const usgPelvisRefRange = document.getElementById("USG PelvisReferenceRange").value;
          const usgPelvisComments = document.getElementById("USG PelvisComments").value;

          // USG Neck
          const usgNeckResult = document.getElementById("USG Neck").value;
          const usgNeckUnit = document.getElementById("USG NeckUnit").value;
          const usgNeckRefRange = document.getElementById("USG NeckReferenceRange").value;
          const usgNeckComments = document.getElementById("USG NeckComments").value;

          console.log({
            usgAbdomenResult,
            usgAbdomenUnit,
            usgAbdomenRefRange,
            usgAbdomenComments,
            usgKUBResult,
            usgKUBUnit,
            usgKUBRefRange,
            usgKUBComments,
            usgPelvisResult,
            usgPelvisUnit,
            usgPelvisRefRange,
            usgPelvisComments,
            usgNeckResult,
            usgNeckUnit,
            usgNeckRefRange,
            usgNeckComments,
          });
        }}
      >
        Add Data
      </button>
    </div>
  </div>
)}




{selectedOption === "CT" && (
  <div>
    <h3 className="text-lg font-medium">CT</h3>
    
    <div className="grid grid-cols-4 gap-4">
      {/* CT Brain */}
      <div className="col-span-1">
        <label htmlFor="CT Brain" className="block text-sm font-medium text-gray-700">
          CT Brain
        </label>
        <select
          id="CT Brain"
          name="CT Brain"
          className="py-4 mt-1 block w-full border-gray-300 bg-blue-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Normal">Normal</option>
          <option value="Abnormal">Abnormal</option>
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height to h-10 (or any desired value)
          />
        </div>
      </div>

      {/* CT Lungs */}
      <div className="col-span-1">
        <label htmlFor="CT Lungs" className="block text-sm font-medium text-gray-700">
          CT Lungs
        </label>
        <select
          id="CT Lungs"
          name="CT Lungs"
          className="py-4 mt-1 block w-full border-gray-300 bg-blue-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Normal">Normal</option>
          <option value="Abnormal">Abnormal</option>
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height to h-10
          />
        </div>
      </div>

      {/* CT Abdomen */}
      <div className="col-span-1">
        <label htmlFor="CT Abdomen" className="block text-sm font-medium text-gray-700">
          CT Abdomen
        </label>
        <select
          id="CT Abdomen"
          name="CT Abdomen"
          className="py-4 mt-1 block w-full border-gray-300 bg-blue-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Normal">Normal</option>
          <option value="Abnormal">Abnormal</option>
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height to h-10
          />
        </div>
      </div>

      {/* CT Spine */}
      <div className="col-span-1">
        <label htmlFor="CT Spine" className="block text-sm font-medium text-gray-700">
          CT Spine
        </label>
        <select
          id="CT Spine"
          name="CT Spine"
          className="py-4 mt-1 block w-full border-gray-300 bg-blue-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Normal">Normal</option>
          <option value="Abnormal">Abnormal</option>
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height to h-10
          />
        </div>
      </div>

      {/* CT Pelvis */}
      <div className="col-span-1">
        <label htmlFor="CT Pelvis" className="block text-sm font-medium text-gray-700">
          CT Pelvis
        </label>
        <select
          id="CT Pelvis"
          name="CT Pelvis"
          className="py-4 mt-1 block w-full border-gray-300 bg-blue-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Normal">Normal</option>
          <option value="Abnormal">Abnormal</option>
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-2 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12" // Reduced height to h-10
          />
        </div>
      </div>
    </div>

  
    <div className="flex justify-end mt-4">
      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={() => {
          // Add your logic to handle adding data here
          console.log("Add Data button clicked!");

          // CT Brain
          const ctBrainResult = document.getElementById("CT Brain").value;
          const ctBrainUnit = document.getElementById("CT BrainUnit").value;
          const ctBrainRefRange = document.getElementById("CT BrainReferenceRange").value;
          const ctBrainComments = document.getElementById("CT BrainComments").value;

          // CT Lungs
          const ctLungsResult = document.getElementById("CT Lungs").value;
          const ctLungsUnit = document.getElementById("CT LungsUnit").value;
          const ctLungsRefRange = document.getElementById("CT LungsReferenceRange").value;
          const ctLungsComments = document.getElementById("CT LungsComments").value;

          // CT Abdomen
          const ctAbdomenResult = document.getElementById("CT Abdomen").value;
          const ctAbdomenUnit = document.getElementById("CT AbdomenUnit").value;
          const ctAbdomenRefRange = document.getElementById("CT AbdomenReferenceRange").value;
          const ctAbdomenComments = document.getElementById("CT AbdomenComments").value;

          // CT Spine
          const ctSpineResult = document.getElementById("CT Spine").value;
          const ctSpineUnit = document.getElementById("CT SpineUnit").value;
          const ctSpineRefRange = document.getElementById("CT SpineReferenceRange").value;
          const ctSpineComments = document.getElementById("CT SpineComments").value;

          // CT Pelvis
          const ctPelvisResult = document.getElementById("CT Pelvis").value;
          const ctPelvisUnit = document.getElementById("CT PelvisUnit").value;
          const ctPelvisRefRange = document.getElementById("CT PelvisReferenceRange").value;
          const ctPelvisComments = document.getElementById("CT PelvisComments").value;

          console.log({
            ctBrainResult,
            ctBrainUnit,
            ctBrainRefRange,
            ctBrainComments,
            ctLungsResult,
            ctLungsUnit,
            ctLungsRefRange,
            ctLungsComments,
            ctAbdomenResult,
            ctAbdomenUnit,
            ctAbdomenRefRange,
            ctAbdomenComments,
            ctSpineResult,
            ctSpineUnit,
            ctSpineRefRange,
            ctSpineComments,
            ctPelvisResult,
            ctPelvisUnit,
            ctPelvisRefRange,
            ctPelvisComments,
          });
        }}
      >
        Add Data
      </button>
    </div>
  </div>
)}


      {selectedOption === "MRI" && (
  <div>
    <h3 className="text-lg font-medium">MRI</h3>

    <div className="grid grid-cols-3 gap-4">
      {/* MRI Brain */}
      <div className="col-span-1">
        <label htmlFor="MRI Brain" className="block text-sm font-medium text-gray-700">
          MRI Brain
        </label>
        <select
          id="MRI Brain"
          name="MRI Brain"
          className="py-4 mt-1 block w-full border-gray-300 bg-blue-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Normal">Normal</option>
          <option value="Abnormal">Abnormal</option>
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* MRI Lungs */}
      <div className="col-span-1">
        <label htmlFor="MRI Lungs" className="block text-sm font-medium text-gray-700">
          MRI Lungs
        </label>
        <select
          id="MRI Lungs"
          name="MRI Lungs"
          className="py-4 mt-1 block w-full border-gray-300 bg-blue-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Normal">Normal</option>
          <option value="Abnormal">Abnormal</option>
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* MRI Abdomen */}
      <div className="col-span-1">
        <label htmlFor="MRI Abdomen" className="block text-sm font-medium text-gray-700">
          MRI Abdomen
        </label>
        <select
          id="MRI Abdomen"
          name="MRI Abdomen"
          className="py-4 mt-1 block w-full border-gray-300 bg-blue-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Normal">Normal</option>
          <option value="Abnormal">Abnormal</option>
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* MRI Spine */}
      <div className="col-span-1">
        <label htmlFor="MRI Spine" className="block text-sm font-medium text-gray-700">
          MRI Spine
        </label>
        <select
          id="MRI Spine"
          name="MRI Spine"
          className="py-4 mt-1 block w-full border-gray-300 bg-blue-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Normal">Normal</option>
          <option value="Abnormal">Abnormal</option>
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* MRI Pelvis */}
      <div className="col-span-1">
        <label htmlFor="MRI Pelvis" className="block text-sm font-medium text-gray-700">
          MRI Pelvis
        </label>
        <select
          id="MRI Pelvis"
          name="MRI Pelvis"
          className="py-4 mt-1 block w-full border-gray-300 bg-blue-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Normal">Normal</option>
          <option value="Abnormal">Abnormal</option>
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="py-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>

    {/* Add Data Button */}
    <div className="col-span-3 flex justify-end mt-4 ">
      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline "
        onClick={() => {
          // Add your logic to handle adding data here
          console.log("Add Data button clicked!");
          // You can collect the values from the input fields and do something with them.
          // For example:
          const brainResult = document.getElementById("MRI Brain").value;
          const brainUnit = document.getElementById("MRI BrainUnit").value;
          const brainRefRange = document.getElementById("MRI BrainReferenceRange").value;

          const lungsResult = document.getElementById("MRI Lungs").value;
          const lungsUnit = document.getElementById("MRI LungsUnit").value;
          const lungsRefRange = document.getElementById("MRI LungsReferenceRange").value;

          const abdomenResult = document.getElementById("MRI Abdomen").value;
          const abdomenUnit = document.getElementById("MRI AbdomenUnit").value;
          const abdomenRefRange = document.getElementById("MRI AbdomenReferenceRange").value;

          const spineResult = document.getElementById("MRI Spine").value;
          const spineUnit = document.getElementById("MRI SpineUnit").value;
          const spineRefRange = document.getElementById("MRI SpineReferenceRange").value;

          const pelvisResult = document.getElementById("MRI Pelvis").value;
          const pelvisUnit = document.getElementById("MRI PelvisUnit").value;
          const pelvisRefRange = document.getElementById("MRI PelvisReferenceRange").value;

          console.log({
            brainResult,
            brainUnit,
            brainRefRange,
            lungsResult,
            lungsUnit,
            lungsRefRange,
            abdomenResult,
            abdomenUnit,
            abdomenRefRange,
            spineResult,
            spineUnit,
            spineRefRange,
            pelvisResult,
            pelvisUnit,
            pelvisRefRange,
          });
        }}
      >
        Add Data
      </button>
    </div>
  </div>
)}
    </div>
  );
}

export default InvestigationForm;
