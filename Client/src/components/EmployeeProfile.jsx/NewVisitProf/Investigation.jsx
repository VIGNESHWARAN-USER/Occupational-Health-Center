import React, { useState } from "react";

const Investigation = ({data}) => {
  const [selectedInvestigation, setSelectedInvestigation] = useState("");

  const handleInvestigationChange = (e) => {
    setSelectedInvestigation(e.target.value);
  };
  console.log(data)
  const renderTableForInvestigation = () => {
    if (selectedInvestigation === "HAEMATOLOGY") {
      return (
        <div className="grid w-full grid-cols-1 gap-4">
          {[
            { label: "Hemoglobin", data: data.haematology.hemoglobin },
            { label: "Total RBC", data: data.haematology.totalRBC },
            { label: "Total WBC", data: data.haematology.totalWBC },
            { label: "Neutrophil", data: data.haematology.neutrophil },
            { label: "Monocyte", data: data.haematology.monocyte },
            { label: "PCV", data: data.haematology.pcv },
            { label: "MCV", data: data.haematology.mcv },
            { label: "MCH", data: data.haematology.mch },
            { label: "Lymphocyte", data: data.haematology.lymphocyte },
            { label: "ESR", data: data.haematology.esr },
            { label: "MCHC", data: data.haematology.mchc },
            { label: "Platelet Count", data: data.haematology.plateletCount },
            { label: "RDW", data: data.haematology.rdw },
            { label: "Eosinophil", data: data.haematology.eosinophil },
            { label: "Basophil", data: data.haematology.basophil },
          ].map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 items-center">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {item.label}
              </label>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.data || 'No data available'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.data || 'No data available'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.data || 'No data available'}
              </div>
            </div>
          ))}
        </div>
      );
    }
    

    if (selectedInvestigation === "ROUTINE SUGAR TESTS") {
      return (
        <div className="grid w-full grid-cols-1 gap-4">
          {[
            { label: "Glucose (F)", data: data.routinesugartests.glucoseF },
            { label: "Glucose (PP)", data: data.routinesugartests.glucosePP },
            { label: "Random Blood Sugar", data: data.routinesugartests.randomBloodSugar },
            { label: "Estimated Average Glucose", data: data.routinesugartests.avgGlucose },
            { label: "HbA1c", data: data.routinesugartests.hba1c },
          ].map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 items-center">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {item.label}
              </label>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.data || 'No data available'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.data || 'No data available'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.data || 'No data available'}
              </div>
            </div>
          ))}
        </div>
      );
    }
    

    if (selectedInvestigation === "RENAL FUNCTION TEST & ELECTROLYTES") {
      return (
        <div className="grid grid-cols-1 gap-4">
          {[
            { label: "Urea", data: data.renalFunctionTests.urea },
            { label: "BUN", data: data.renalFunctionTests.bun },
            { label: "Calcium", data: data.renalFunctionTests.calcium },
            { label: "Sodium", data: data.renalFunctionTests.sodium },
            { label: "Potassium", data: data.renalFunctionTests.potassium },
            { label: "Phosphorus", data: data.renalFunctionTests.phosphorus },
            { label: "Serum Creatinine", data: data.renalFunctionTests.serumCreatinine },
            { label: "Uric Acid", data: data.renalFunctionTests.uricAcid },
            { label: "Chloride", data: data.renalFunctionTests.chloride },
          ].map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 items-center">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {item.label}
              </label>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.data || 'No data available'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.data || 'No data available'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.data || 'No data available'}
              </div>
            </div>
          ))}
        </div>
      );
    }
    

    if (selectedInvestigation === "LIPID PROFILE") {
      return (
        <div className="grid grid-cols-1 gap-4">
          {[
            { label: "Total Cholesterol", data: data.lipidProfile.totalCholesterol },
            { label: "Triglycerides", data: data.lipidProfile.triglycerides },
            { label: "HDL - Cholesterol", data: data.lipidProfile.hdlCholesterol },
            { label: "LDL - Cholesterol", data: data.lipidProfile.ldlCholesterol },
            { label: "CHOL HDL ratio", data: data.lipidProfile.cholHdlRatio },
            { label: "VLDL - Cholesterol", data: data.lipidProfile.vldlCholesterol },
            { label: "LDL.CHOL/HDL.CHOL Ratio", data: data.lipidProfile.ldlHdlRatio },
          ].map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 items-center">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {item.label}
              </label>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.data || 'No data available'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.data || 'No data available'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.data || 'No data available'}
              </div>
            </div>
          ))}
        </div>
      );
    }
    

    if (selectedInvestigation === "LIVER FUNCTION TEST") {
      return (
        <div className="grid grid-cols-1 gap-4">
          {[
            { label: "Bilirubin - Total", data: data.liverFunctionTest.bilirubinTotal },
            { label: "Bilirubin - Direct", data: data.liverFunctionTest.bilirubinDirect },
            { label: "Bilirubin - Indirect", data: data.liverFunctionTest.bilirubinIndirect },
            { label: "SGOT /AST", data: data.liverFunctionTest.sgotAst },
            { label: "SGPT /ALT", data: data.liverFunctionTest.sgptAlt },
            { label: "Alkaline phosphatase", data: data.liverFunctionTest.alkalinePhosphatase },
            { label: "Total Protein", data: data.liverFunctionTest.totalProtein },
            { label: "Albumin (Serum)", data: data.liverFunctionTest.albuminSerum },
            { label: "Globulin (Serum)", data: data.liverFunctionTest.globulinSerum },
            { label: "Alb/Glob Ratio", data: data.liverFunctionTest.albGlobRatio },
            { label: "Gamma Glutamyl transferase", data: data.liverFunctionTest.gammaGlutamylTransferase },
          ].map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 items-center">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {item.label}
              </label>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.data || 'No data available'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.data || 'No data available'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.data || 'No data available'}
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    if (selectedInvestigation === "THYROID FUNCTION TEST") {
      return (
        <div className="grid grid-cols-1 gap-4">
          {[
            { label: "T3 - Triiodothyronine", data: data.thyroidFunctionTest.t3 },
            { label: "T4 - Thyroxine", data: data.thyroidFunctionTest.t4 },
            { label: "TSH - Thyroid Stimulating Hormone", data: data.thyroidFunctionTest.tsh },
          ].map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 items-center">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {item.label}
              </label>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.data || 'No data available'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.data || 'No data available'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.data || 'No data available'}
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    if (selectedInvestigation === "AUTOIMMUNE TEST") {
      return (
        <div className="grid grid-cols-1 gap-4">
          {[
            { label: "ANA (Antinuclear Antibody)", data: data.autoimmuneTest.ana },
            { label: "Anti ds DNA", data: data.autoimmuneTest.antiDsDna },
            { label: "Anticardiolipin Antibodies (IgG & IgM)", data: data.autoimmuneTest.anticardiolipin },
            { label: "Rheumatoid Factor", data: data.autoimmuneTest.rheumatoidFactor },
          ].map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 items-center">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {item.label}
              </label>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.data || 'No data available'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.data || 'No data available'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.data || 'No data available'}
              </div>
            </div>
          ))}
        </div>
      );
    }
    

    if (selectedInvestigation === "COAGULATION TEST") {
      return (
        <div className="grid grid-cols-1 gap-4">
          {[
            { label: "Prothrombin Time (PT)", data: data.coagulationtest.prothrombin_time, comments: data.coagulationtest.prothrombin_time_comments, ref: data.coagulationtest.prothrombin_time_reference_range, unit:  data.coagulationtest.prothrombin_time_unit},
            { label: "PT INR", data: data.coagulationtest.pt_inr },
            { label: "Clotting Time (CT)", data: data.coagulationtest.clotting_time },
            { label: "Bleeding Time (BT)", data: data.coagulationtest.bleeding_time },
          ].map((item, index) => (
            <div key={index} className="grid grid-cols-5 gap-4 items-center">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {item.label}
              </label>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.data || 'No data available'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.unit || 'No data available'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.ref || 'No data available'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.comments || 'No data available'}
              </div>
            </div>
          ))}
        </div>
      );
    }
    

    if (selectedInvestigation === "ENZYMES & CARDIAC Profile") {
      return (
        <div className="grid grid-cols-1 gap-4">
          {[
            { label: "Acid Phosphatase", data: data.enzymesCardiacProfile.acidPhosphatase },
            { label: "Adenosine Deaminase", data: data.enzymesCardiacProfile.adenosineDeaminase },
            { label: "Amylase", data: data.enzymesCardiacProfile.amylase },
            { label: "ECG (Normal)", data: data.enzymesCardiacProfile.ecgNormal },
            { label: "Troponin-T", data: data.enzymesCardiacProfile.troponinT },
            { label: "CPK - TOTAL", data: data.enzymesCardiacProfile.cpkTotal },
            { label: "ECHO (Normal)", data: data.enzymesCardiacProfile.echoNormal },
            { label: "Lipase", data: data.enzymesCardiacProfile.lipase },
            { label: "CPK - MB", data: data.enzymesCardiacProfile.cpkMb },
            { label: "TMT (Normal)", data: data.enzymesCardiacProfile.tmtNormal },
          ].map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 items-center">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {item.label}
              </label>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.data || 'No data available'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.data || 'No data available'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.data || 'No data available'}
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    if (selectedInvestigation === "URINE ROUTINE") {
      return (
        <div className="grid grid-cols-1 gap-4">
          {[
            { label: "Colour", data: data.urineRoutine.colour },
            { label: "Appearance", data: data.urineRoutine.appearance },
            { label: "Reaction (pH)", data: data.urineRoutine.reactionPH },
            { label: "Specific gravity", data: data.urineRoutine.specificGravity },
            { label: "Crystals", data: data.urineRoutine.crystals },
            { label: "Bacteria", data: data.urineRoutine.bacteria },
            { label: "Protein/Albumin", data: data.urineRoutine.proteinAlbumin },
            { label: "Glucose (Urine)", data: data.urineRoutine.glucoseUrine },
            { label: "Ketone Bodies", data: data.urineRoutine.ketoneBodies },
            { label: "Urobilinogen", data: data.urineRoutine.urobilinogen },
            { label: "Casts", data: data.urineRoutine.casts },
            { label: "Bile Salts", data: data.urineRoutine.bileSalts },
            { label: "Bile Pigments", data: data.urineRoutine.bilePigments },
            { label: "WBC / Pus cells", data: data.urineRoutine.wbcPusCells },
            { label: "Red Blood Cells", data: data.urineRoutine.redBloodCells },
            { label: "Epithelial cells", data: data.urineRoutine.epithelialCells },
          ].map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 items-center">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {item.label}
              </label>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.data || 'No data available'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.data || 'No data available'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.data || 'No data available'}
              </div>
            </div>
          ))}
        </div>
      );
    }
    

    if (selectedInvestigation === "SEROLOGY") {
      return (
        <div className="grid grid-cols-1 gap-4">
          {[
            { label: "Screening For HIV I & II", data: data.serology.hiv },
            { label: "HBsAg", data: data.serology.hbsAg },
            { label: "HCV", data: data.serology.hcv },
            { label: "VDRL", data: data.serology.vdrl },
            { label: "Dengue NS1Ag", data: data.serology.dengueNS1Ag },
            { label: "Dengue IgG", data: data.serology.dengueIgG },
            { label: "Dengue IgM", data: data.serology.dengueIgM },
            { label: "WIDAL", data: data.serology.widal },
          ].map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 items-center">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {item.label}
              </label>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.data || 'No data available'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.data || 'No data available'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {item.data || 'No data available'}
              </div>
            </div>
          ))}
        </div>
      );
    }
    

    if (selectedInvestigation === "MOTION") {
      return (
        <div className="grid grid-cols-1 gap-4">
          {[
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
            <div key={index} className="grid grid-cols-4 gap-4 items-center">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {label}
              </label>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {data.data || 'No data available'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {data.data || 'No data available'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {data.data || 'No data available'}
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    if (selectedInvestigation === "ROUTINE CULTURE & SENSITIVITY TEST") {
      return (
        <div className="grid grid-cols-1 gap-4">
          {["Urine", "Motion", "Sputum", "Blood"].map((label, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 items-center">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {label}
              </label>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {data.data || 'No data available'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {data.data || 'No data available'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {data.data || 'No data available'}
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    if (selectedInvestigation === "Men's Pack") {
      return (
        <div className="grid grid-cols-1 gap-4">
          {["PSA (Prostate Specific Antigen)"].map((label, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 items-center">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {label}
              </label>
              <input
                type="text"
                placeholder="Unit (in %) or ng/ml"
                className="p-2 border border-gray-300 rounded text-sm md:text-base w-full"
              />
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {data.data || 'No data available'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
                {data.data || 'No data available'}
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    if (selectedInvestigation === "Women's Pack") {
      return (
        <div className="space-y-4">
          {[
            { label: "Mammogram", options: ["Normal", "Abnormal"] },
            { label: "PAP Smear", options: ["Normal", "Abnormal"] },
          ].map((item, index) => (
            <div key={index} className="space-y-2">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {item.label}
              </label>
              <select className="p-2 border border-gray-300 rounded text-sm md:text-base w-full">
                <option value="">Select Result</option>
                {item.options.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      );
    }
    
    if (selectedInvestigation === "Occupational Profile") {
      return (
        <div className="space-y-4">
          {[
            { label: "Audiometry", options: ["Normal", "Abnormal"] },
            { label: "PFT", options: ["Normal", "Abnormal"] },
          ].map((item, index) => (
            <div key={index} className="space-y-2">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {item.label}
              </label>
              <select className="p-2 border border-gray-300 rounded text-sm md:text-base w-full">
                <option value="">Select Result</option>
                {item.options.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      );
    }
    
    if (selectedInvestigation === "Others TEST") {
      return (
        <div className="space-y-4">
          {[
            { label: "Pathology", options: ["Normal", "Abnormal"] },
          ].map((item, index) => (
            <div key={index} className="space-y-2">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {item.label}
              </label>
              <select className="p-2 border border-gray-300 rounded text-sm md:text-base w-full">
                <option value="">Select Result</option>
                {item.options.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      );
    }
    
    if (selectedInvestigation === "OPHTHALMIC REPORT") {
      return (
        <div className="space-y-4">
          {[
            { label: "Vision", options: ["Normal", "Abnormal"] },
            { label: "Color Vision", options: ["Normal", "Abnormal"] },
          ].map((item, index) => (
            <div key={index} className="space-y-2">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {item.label}
              </label>
              <select className="p-2 border border-gray-300 rounded text-sm md:text-base w-full">
                <option value="">Select Result</option>
                {item.options.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      );
    }
    
    if (selectedInvestigation === "X-RAY") {
      return (
        <div className="space-y-4">
          {[
            { label: "X-RAY Chest", options: ["Normal", "Abnormal"] },
            { label: "X-RAY KUB", options: ["Normal", "Abnormal"] },
            { label: "X-RAY Spine", options: ["Normal", "Abnormal"] },
            { label: "X-RAY Pelvis", options: ["Normal", "Abnormal"] },
            { label: "X-RAY Abdomen", options: ["Normal", "Abnormal"] },
          ].map((item, index) => (
            <div key={index} className="space-y-2">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {item.label}
              </label>
              <select className="p-2 border border-gray-300 rounded text-sm md:text-base w-full">
                <option value="">Select Result</option>
                {item.options.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      );
    }
    
    if (selectedInvestigation === "USG") {
      return (
        <div className="space-y-4">
          {[
            { label: "USG Abdomen", options: ["Normal", "Abnormal"] },
            { label: "USG KUB", options: ["Normal", "Abnormal"] },
            { label: "USG Pelvis", options: ["Normal", "Abnormal"] },
            { label: "USG Neck", options: ["Normal", "Abnormal"] },
          ].map((item, index) => (
            <div key={index} className="space-y-2">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {item.label}
              </label>
              <select className="p-2 border border-gray-300 rounded text-sm md:text-base w-full">
                <option value="">Select Result</option>
                {item.options.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      );
    }
    
    if (selectedInvestigation === "CT") {
      return (
        <div className="space-y-4">
          {[
            { label: "CT Brain", options: ["Normal", "Abnormal"] },
            { label: "CT Lungs", options: ["Normal", "Abnormal"] },
            { label: "CT Abdomen", options: ["Normal", "Abnormal"] },
            { label: "CT Spine", options: ["Normal", "Abnormal"] },
            { label: "CT Pelvis", options: ["Normal", "Abnormal"] },
          ].map((item, index) => (
            <div key={index} className="space-y-2">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {item.label}
              </label>
              <select className="p-2 border border-gray-300 rounded text-sm md:text-base w-full">
                <option value="">Select Result</option>
                {item.options.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      );
    }
    if (selectedInvestigation === "MRI") {
      return (
        <div className="space-y-4">
          {[
            { label: "MRI Brain", options: ["Normal", "Abnormal"] },
            { label: "MRI Spine", options: ["Normal", "Abnormal"] },
            { label: "MRI Abdomen", options: ["Normal", "Abnormal"] },
            { label: "MRI Pelvis", options: ["Normal", "Abnormal"] },
          ].map((item, index) => (
            <div key={index} className="space-y-2">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {item.label}
              </label>
              <select className="p-2 border border-gray-300 rounded text-sm md:text-base w-full">
                <option value="">Select Result</option>
                {item.options.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      );
    }
        
    return null;
  };

  return (
    <div className="">
      
      {/* Form Container */}
      <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
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

        
        {/* Render Table for Selected Investigation */}
        {renderTableForInvestigation()}
      </div>
    </div>
  );
};

export default Investigation;