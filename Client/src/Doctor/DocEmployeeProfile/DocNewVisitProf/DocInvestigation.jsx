import React, { useState } from "react";

const Investigation = () => {
  const [selectedInvestigation, setSelectedInvestigation] = useState("");

  const handleInvestigationChange = (e) => {
    setSelectedInvestigation(e.target.value);
  };

  const renderTableForInvestigation = () => {
    if (selectedInvestigation === "HAEMATOLOGY") {
      return [
        "Hemoglobin",
        "Total RBC",
        "Total WBC",
        "Neutrophil",
        "Monocyte",
        "PCV",
        "MCV",
        "MCH",
        "Lymphocyte",
        "ESR",
        "MCHC",
        "Platelet Count",
        "RDW",
        "Eosinophil",
        "Basophil",
      ].map((label, index) => (
        <React.Fragment key={index}>
          <label className="text-gray-700 font-medium text-sm md:text-base">
            {label}
          </label>
          <input
            type="text"
            placeholder="Unit (in %)"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
          <input
            type="text"
            placeholder="Reference Range"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
          <input
            type="text"
            placeholder="Comments"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
        </React.Fragment>
      ));
    }

    if (selectedInvestigation === "ROUTINE SUGAR TESTS") {
      return [
        "Glucose (F)",
        "Glucose (PP)",
        "Random Blood Sugar",
        "Estimated Average Glucose",
        "HbA1c",
      ].map((label, index) => (
        <React.Fragment key={index}>
          <label className="text-gray-700 font-medium text-sm md:text-base">
            {label}
          </label>
          <input
            type="text"
            placeholder="Unit (in %)"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
          <input
            type="text"
            placeholder="Reference Range"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
          <input
            type="text"
            placeholder="Comments"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
        </React.Fragment>
      ));
    }

    if (selectedInvestigation === "RENAL FUNCTION TEST & ELECTROLYTES") {
      return [
        "Urea",
        "BUN",
        "Calcium",
        "Sodium",
        "Potassium",
        "Phosphorus",
        "Serum Creatinine",
        "Uric Acid",
        "Chloride",
      ].map((label, index) => (
        <React.Fragment key={index}>
          <label className="text-gray-700 font-medium text-sm md:text-base">
            {label}
          </label>
          <input
            type="text"
            placeholder="Unit (in %)"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
          <input
            type="text"
            placeholder="Reference Range"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
          <input
            type="text"
            placeholder="Comments"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
        </React.Fragment>
      ));
    }

    if (selectedInvestigation === "LIPID PROFILE") {
      return [
        "Total Cholesterol",
        "Triglycerides",
        "HDL - Cholesterol",
        "LDL - Cholesterol",
        "CHOL HDL ratio",
        "VLDL - Cholesterol",
        "LDL.CHOL/HDL.CHOL Ratio",
      ].map((label, index) => (
        <React.Fragment key={index}>
          <label className="text-gray-700 font-medium text-sm md:text-base">
            {label}
          </label>
          <input
            type="text"
            placeholder="Unit (in %)"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
          <input
            type="text"
            placeholder="Reference Range"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
          <input
            type="text"
            placeholder="Comments"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
        </React.Fragment>
      ));
    }

    if (selectedInvestigation === "LIVER FUNCTION TEST") {
      return [
        "Bilirubin - Total",
        "Bilirubin - Direct",
        "Bilirubin - Indirect",
        "SGOT /AST",
        "SGPT /ALT",
        "Alkaline phosphatase",
        "Total Protein",
        "Albumin (Serum)",
        "Globulin (Serum)",
        "Alb/Glob Ratio",
        "Gamma Glutamyl transferase",
      ].map((label, index) => (
        <React.Fragment key={index}>
          <label className="text-gray-700 font-medium text-sm md:text-base">
            {label}
          </label>
          <input
            type="text"
            placeholder="Unit (in %)"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
          <input
            type="text"
            placeholder="Reference Range"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
          <input
            type="text"
            placeholder="Comments"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
        </React.Fragment>
      ));
    }

    if (selectedInvestigation === "THYROID FUNCTION TEST") {
      return [
        "T3 - Triiodothyroine",
        "T4 - Thyroxine",
        "TSH - Thyroid Stimulating Hormone",
      ].map((label, index) => (
        <React.Fragment key={index}>
          <label className="text-gray-700 font-medium text-sm md:text-base">
            {label}
          </label>
          <input
            type="text"
            placeholder="Unit (in %)"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
          <input
            type="text"
            placeholder="Reference Range"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
          <input
            type="text"
            placeholder="Comments"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
        </React.Fragment>
      ));
    }
    if (selectedInvestigation === "AUTOIMMUNE TEST") {
      return [
        "ANA (Antinuclear Antibody)",
        "Anti ds DNA",
        "Anticardiolipin Antibodies (IgG & IgM)",
        "Rheumatoid Factor",
      ].map((label, index) => (
        <React.Fragment key={index}>
          <label className="text-gray-700 font-medium text-sm md:text-base">
            {label}
          </label>
          <input
            type="text"
            placeholder="Unit (in %)"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
          <input
            type="text"
            placeholder="Reference Range"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
          <input
            type="text"
            placeholder="Comments"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
        </React.Fragment>
      ));
    }

    if (selectedInvestigation === "COAGULATION TEST") {
      return [
        "Prothrombin Time (PT)",
        "PT INR",
        "Clotting Time (CT)",
        "Bleeding Time (BT)",
      ].map((label, index) => (
        <React.Fragment key={index}>
          <label className="text-gray-700 font-medium text-sm md:text-base">
            {label}
          </label>
          <input
            type="text"
            placeholder="Unit (in %)"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
          <input
            type="text"
            placeholder="Reference Range"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
          <input
            type="text"
            placeholder="Comments"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
        </React.Fragment>
      ));
    }

    if (selectedInvestigation === "ENZYMES & CARDIAC Profile") {
      return [
        "Acid Phosphatase",
        "Adenosine Deaminase",
        "Amylase",
        "ECG (Normal)",
        "Troponin-T",
        "CPK - TOTAL",
        "ECHO (Normal)",
        "Lipase",
        "CPK - MB",
        "TMT (Normal)",
      ].map((label, index) => (
        <React.Fragment key={index}>
          <label className="text-gray-700 font-medium text-sm md:text-base">
            {label}
          </label>
          <input
            type="text"
            placeholder="Unit (in %)"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
          <input
            type="text"
            placeholder="Reference Range"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
          <input
            type="text"
            placeholder="Comments"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
        </React.Fragment>
      ));
    }
    if (selectedInvestigation === "URINE ROUTINE") {
      return [
        "Colour",
        "Appearance",
        "Reaction (pH)",
        "Specific gravity",
        "Crystals",
        "Bacteria",
        "Protein/Albumin",
        "Glucose (Urine)",
        "Ketone Bodies",
        "Urobilinogen",
        "Casts",
        "Bile Salts",
        "Bile Pigments",
        "WBC / Pus cells",
        "Red Blood Cells",
        "Epithelial cells",
      ].map((label, index) => (
        <React.Fragment key={index}>
          <label className="text-gray-700 font-medium text-sm md:text-base">
            {label}
          </label>
          <input
            type="text"
            placeholder="Unit (in %)"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
          <input
            type="text"
            placeholder="Reference Range"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
          <input
            type="text"
            placeholder="Comments"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
        </React.Fragment>
      ));
    }

    if (selectedInvestigation === "SEROLOGY") {
      return [
        "Screening For HIV I & II",
        "HBsAg",
        "HCV",
        "VDRL",
        "Dengue NS1Ag",
        "Dengue IgG",
        "Dengue IgM",
        "WIDAL",
      ].map((label, index) => (
        <React.Fragment key={index}>
          <label className="text-gray-700 font-medium text-sm md:text-base">
            {label}
          </label>
          <input
            type="text"
            placeholder="Unit (in %)"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
          <input
            type="text"
            placeholder="Reference Range"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
          <input
            type="text"
            placeholder="Comments"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
        </React.Fragment>
      ));
    }

    if (selectedInvestigation === "MOTION") {
      return [
        "Colour (Motion)",
        "Appearance (Motion)",
        "Occult Blood",
        "Cyst",
        "Mucus",
        "Pus Cells",
        "Ova",
        "RBCs",
        "Others",
      ].map((label, index) => (
        <React.Fragment key={index}>
          <label className="text-gray-700 font-medium text-sm md:text-base">
            {label}
          </label>
          <input
            type="text"
            placeholder="Unit (in %)"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
          <input
            type="text"
            placeholder="Reference Range"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
          <input
            type="text"
            placeholder="Comments"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
        </React.Fragment>
      ));
    }

    if (selectedInvestigation === "ROUTINE CULTURE & SENSITIVITY TEST") {
      return [
        "Urine",
        "Motion",
        "Sputum",
        "Blood",
      ].map((label, index) => (
        <React.Fragment key={index}>
          <label className="text-gray-700 font-medium text-sm md:text-base">
            {label}
          </label>
          <input
            type="text"
            placeholder="Unit (in %)"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
          <input
            type="text"
            placeholder="Reference Range"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
          <input
            type="text"
            placeholder="Comments"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
        </React.Fragment>
      ));
    }

    if (selectedInvestigation === "Men's Pack") {
      return [
        "PSA (Prostate Specific Antigen)",
      ].map((label, index) => (
        <React.Fragment key={index}>
          <label className="text-gray-700 font-medium text-sm md:text-base">
            {label}
          </label>
          <input
            type="text"
            placeholder="Unit (in %) or ng/ml"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
          <input
            type="text"
            placeholder="Reference Range"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
          <input
            type="text"
            placeholder="Comments"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
        </React.Fragment>
      ));
    }

    if (selectedInvestigation === "Women's Pack") {
      return [
        {
          label: "Mammogram",
          options: ["Normal", "Abnormal"],
        },
        {
          label: "PAP Smear",
          options: ["Normal", "Abnormal"],
        },
      ].map((item, index) => (
        <React.Fragment key={index}>
          <label className="text-gray-700 font-medium text-sm md:text-base">
            {item.label}
          </label>
          <select className="p-2 border border-gray-300 rounded text-sm md:text-base">
            <option value="">Select Result</option>
            {item.options.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
        </React.Fragment>
      ));
    }
    if (selectedInvestigation === "Occupational Profile") {
      return [
        {
          label: "Audiometry",
          options: ["Normal", "Abnormal"],
        },
        {
          label: "PFT",
          options: ["Normal", "Abnormal"],
        },
      ].map((item, index) => (
        <React.Fragment key={index}>
          <label className="text-gray-700 font-medium text-sm md:text-base">
            {item.label}
          </label>
          <select className="p-2 border border-gray-300 rounded text-sm md:text-base">
            <option value="">Select Result</option>
            {item.options.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
        </React.Fragment>
      ));
    }
    if (selectedInvestigation === "Others TEST") {
      return [
        {
          label: "Pathology",
          options: ["Normal", "Abnormal"],
        },
      ].map((item, index) => (
        <React.Fragment key={index}>
          <label className="text-gray-700 font-medium text-sm md:text-base">
            {item.label}
          </label>
          <select className="p-2 border border-gray-300 rounded text-sm md:text-base">
            <option value="">Select Result</option>
            {item.options.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
        </React.Fragment>
      ));
    }
    if (selectedInvestigation === "OPHTHALMIC REPORT") {
      return [
        {
          label: "Vision",
          options: ["Normal", "Abnormal"],
        },
        {
          label: "Color Vision",
          options: ["Normal", "Abnormal"],
        },
      ].map((item, index) => (
        <React.Fragment key={index}>
          <label className="text-gray-700 font-medium text-sm md:text-base">
            {item.label}
          </label>
          <select className="p-2 border border-gray-300 rounded text-sm md:text-base">
            <option value="">Select Result</option>
            {item.options.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
        </React.Fragment>
      ));
    }

    if (selectedInvestigation === "X-RAY") {
      return [
        {
          label: "X-RAY Chest",
          options: ["Normal", "Abnormal"],
        },
        {
          label: "X-RAY KUB",
          options: ["Normal", "Abnormal"],
        },
        {
          label: "X-RAY Spine",
          options: ["Normal", "Abnormal"],
        },
        {
          label: "X-RAY Pelvis",
          options: ["Normal", "Abnormal"],
        },
        {
          label: "X-RAY Abdomen",
          options: ["Normal", "Abnormal"],
        },
      ].map((item, index) => (
        <React.Fragment key={index}>
          <label className="text-gray-700 font-medium text-sm md:text-base">
            {item.label}
          </label>
          <select className="p-2 border border-gray-300 rounded text-sm md:text-base">
            <option value="">Select Result</option>
            {item.options.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
        </React.Fragment>
      ));
    }

    if (selectedInvestigation === "USG") {
      return [
        {
          label: "USG Abdomen",
          options: ["Normal", "Abnormal"],
        },
        {
          label: "USG KUB",
          options: ["Normal", "Abnormal"],
        },
        {
          label: "USG Pelvis",
          options: ["Normal", "Abnormal"],
        },
        {
          label: "USG Neck",
          options: ["Normal", "Abnormal"],
        },
      ].map((item, index) => (
        <React.Fragment key={index}>
          <label className="text-gray-700 font-medium text-sm md:text-base">
            {item.label}
          </label>
          <select className="p-2 border border-gray-300 rounded text-sm md:text-base">
            <option value="">Select Result</option>
            {item.options.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
        </React.Fragment>
      ));
    }

    if (selectedInvestigation === "CT") {
      return [
        {
          label: "CT Brain",
          options: ["Normal", "Abnormal"],
        },
        {
          label: "CT Lungs",
          options: ["Normal", "Abnormal"],
        },
        {
          label: "CT Abdomen",
          options: ["Normal", "Abnormal"],
        },
        {
          label: "CT Spine",
          options: ["Normal", "Abnormal"],
        },
        {
          label: "CT Pelvis",
          options: ["Normal", "Abnormal"],
        },
      ].map((item, index) => (
        <React.Fragment key={index}>
          <label className="text-gray-700 font-medium text-sm md:text-base">
            {item.label}
          </label>
          <select className="p-2 border border-gray-300 rounded text-sm md:text-base">
            <option value="">Select Result</option>
            {item.options.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
        </React.Fragment>
      ));
    }

    if (selectedInvestigation === "MRI") {
      return [
        {
          label: "MRI Brain",
          options: ["Normal", "Abnormal"],
        },
        {
          label: "MRI Lungs",
          options: ["Normal", "Abnormal"],
        },
        {
          label: "MRI Abdomen",
          options: ["Normal", "Abnormal"],
        },
        {
          label: "MRI Spine",
          options: ["Normal", "Abnormal"],
        },
        {
          label: "MRI Pelvis",
          options: ["Normal", "Abnormal"],
        },
      ].map((item, index) => (
        <React.Fragment key={index}>
          <label className="text-gray-700 font-medium text-sm md:text-base">
            {item.label}
          </label>
          <select className="p-2 border border-gray-300 rounded text-sm md:text-base">
            <option value="">Select Result</option>
            {item.options.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
        </React.Fragment>
      ));
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center py-8">
      {/* Navbar */}
      <div className="bg-blue-200 w-full p-4 flex justify-center">
        <div className="flex space-x-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded text-sm md:text-base">
            Investigations
          </button>
          <button className="bg-white px-4 py-2 rounded text-sm md:text-base">
            Vaccination
          </button>
          <button className="bg-white px-4 py-2 rounded text-sm md:text-base">
            Fitness
          </button>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white p-6 rounded-lg shadow-lg mt-6 w-11/12 md:w-3/4">
        <h2 className="text-lg font-bold mb-4">Select Investigation Form</h2>
        <select
          value={selectedInvestigation}
          onChange={handleInvestigationChange}
          className="w-full p-2 border border-gray-300 rounded mb-6 text-sm md:text-base"
        >
          <option value="">Select Investigation</option>
          <option value="HAEMATOLOGY">HAEMATOLOGY</option>
          <option value="ROUTINE SUGAR TESTS">Routine Sugar Tests</option>
          <option value="RENAL FUNCTION TEST & ELECTROLYTES">
            RENAL FUNCTION TEST & ELECTROLYTES
          </option>
          <option value="LIPID PROFILE">LIPID PROFILE</option>
          <option value="LIVER FUNCTION TEST">LIVER FUNCTION TEST</option>
          <option value="THYROID FUNCTION TEST">THYROID FUNCTION TEST</option>
          <option value="COAGULATION TEST">COAGULATION TEST</option>
          <option value="ENZYMES & CARDIAC Profile">ENZYMES & CARDIAC Profile</option>
          <option value="URINE ROUTINE">URINE ROUTINE</option>
          <option value="SEROLOGY">SEROLOGY</option>
          <option value="MOTION">MOTION</option>
          <option value="ROUTINE CULTURE & SENSITIVITY TEST">CROUTINE CULTURE & SENSITIVITY TEST</option>
          <option value="Men's Pack">Men's Pack</option>
          <option value="Women's Pack">Women's Pack</option>
          <option value="Occupational Profile">Occupational Profile</option>
          <option value="Others TEST">Others TEST</option>
          <option value="OPTHALMIC REPORT">OPTHALMIC REPORT</option>
          <option value="X-RAY">X-RAY</option>
          <option value="USG">USG</option>
          <option value="CT">CT</option>
          <option value="MRI">MRI</option>
        </select>

        {/* Employee No Field */}
        <div className="mb-6">
          <label className="text-gray-700 font-medium text-sm md:text-base">
            Employee No
          </label>
          <input
            type="text"
            placeholder="Enter Employee No"
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          />
        </div>

        {/* Render Table for Selected Investigation */}
        {renderTableForInvestigation()}
      </div>
    </div>
  );
};

export default Investigation;