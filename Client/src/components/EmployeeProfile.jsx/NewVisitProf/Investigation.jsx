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
          <div className="grid grid-cols-5 gap-4 items-center">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {"Name"}
              </label>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {"Data"}
              </div>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {'Reference range'}
              </div>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {'Unit'}
              </div>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {'Comments'}
              </div>
            </div>
          {[
            { label: "Hemoglobin", data: data.haematology.hemoglobin, rr: data.haematology.hemoglobin_reference_range, unit: data.haematology.hemoglobin_unit, comments: data.haematology.hemoglobin_comments },
            { label: "Total RBC", data: data.haematology.totalRBC, rr: data.haematology.totalRBC_reference_range, unit: data.haematology.totalRBC_unit, comments: data.haematology.totalRBC_comments },
            { label: "Total WBC", data: data.haematology.totalWBC, rr: data.haematology.totalWBC_reference_range, unit: data.haematology.totalWBC_unit, comments: data.haematology.totalWBC_comments },
            { label: "Neutrophil", data: data.haematology.neutrophil, rr: data.haematology.neutrophil_reference_range, unit: data.haematology.neutrophil_unit, comments: data.haematology.neutrophil_comments },
            { label: "Monocyte", data: data.haematology.monocyte, rr: data.haematology.monocyte_reference_range, unit: data.haematology.monocyte_unit, comments: data.haematology.monocyte_comments },
            { label: "PCV", data: data.haematology.pcv, rr: data.haematology.pcv_reference_range, unit: data.haematology.pcv_unit, comments: data.haematology.pcv_comments },
            { label: "MCV", data: data.haematology.mcv, rr: data.haematology.mcv_reference_range, unit: data.haematology.mcv_unit, comments: data.haematology.mcv_comments },
            { label: "MCH", data: data.haematology.mch, rr: data.haematology.mch_reference_range, unit: data.haematology.mch_unit, comments: data.haematology.mch_comments },
            { label: "Lymphocyte", data: data.haematology.lymphocyte, rr: data.haematology.lymphocyte_reference_range, unit: data.haematology.lymphocyte_unit, comments: data.haematology.lymphocyte_comments },
            { label: "ESR", data: data.haematology.esr, rr: data.haematology.esr_reference_range, unit: data.haematology.esr_unit, comments: data.haematology.esr_comments },
            { label: "MCHC", data: data.haematology.mchc, rr: data.haematology.mchc_reference_range, unit: data.haematology.mchc_unit, comments: data.haematology.mchc_comments },
            { label: "Platelet Count", data: data.haematology.plateletCount, rr: data.haematology.plateletCount_reference_range, unit: data.haematology.plateletCount_unit, comments: data.haematology.plateletCount_comments },
            { label: "RDW", data: data.haematology.rdw, rr: data.haematology.rdw_reference_range, unit: data.haematology.rdw_unit, comments: data.haematology.rdw_comments },
            { label: "Eosinophil", data: data.haematology.eosinophil, rr: data.haematology.eosinophil_reference_range, unit: data.haematology.eosinophil_unit, comments: data.haematology.eosinophil_comments },
            { label: "Basophil", data: data.haematology.basophil, rr: data.haematology.basophil_reference_range, unit: data.haematology.basophil_unit, comments: data.haematology.basophil_comments },
          ].map((item, index) => (
            <div key={index} className="grid grid-cols-5 gap-4 items-center">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {item.label}
              </label>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                {item.data || 'No data'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                {item.rr || 'No reference range'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                {item.unit || 'No unit'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                {item.comments || 'No comments'}
              </div>
            </div>
          ))}
        </div>
      );
    }
    

    if (selectedInvestigation === "ROUTINE SUGAR TESTS") {
      return (
        <div className="grid w-full grid-cols-1 gap-4">
          <div className="grid grid-cols-5 gap-4 items-center">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {"Name"}
              </label>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {"Data"}
              </div>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {'Reference range'}
              </div>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {'Unit'}
              </div>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {'Comments'}
              </div>
            </div>
          {[
            { label: "Glucose (F)", data: data.routinesugartests.glucose_f, rr: data.routinesugartests.glucose_f_reference_range, unit: data.routinesugartests.glucose_f_unit, comments: data.routinesugartests.glucose_f_comments },
            { label: "Glucose (PP)", data: data.routinesugartests.glucose_pp, rr: data.routinesugartests.glucose_pp_reference_range, unit: data.routinesugartests.glucose_pp_unit, comments: data.routinesugartests.glucose_pp_comments },
            { label: "Random Blood Sugar", data: data.routinesugartests.random_blood_sugar, rr: data.routinesugartests.random_blood_sugar_reference_range, unit: data.routinesugartests.random_blood_sugar_unit, comments: data.routinesugartests.random_blood_sugar_comments },
            { label: "Estimated Average Glucose", data: data.routinesugartests.estimated_average_glucose, rr: data.routinesugartests.estimated_average_glucose_reference_range, unit: data.routinesugartests.estimated_average_glucose_unit, comments: data.routinesugartests.estimated_average_glucose_comments },
            { label: "HbA1c", data: data.routinesugartests.hba1c, rr: data.routinesugartests.hba1c_reference_range, unit: data.routinesugartests.hba1c_unit, comments: data.routinesugartests.hba1c_comments },
          ].map((item, index) => (
            <div key={index} className="grid grid-cols-5 gap-4 items-center">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {item.label}
              </label>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                {item.data || 'No data'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                {item.rr || 'No reference range'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                {item.unit || 'No unit'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                {item.comments || 'No comments'}
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    

    if (selectedInvestigation === "RENAL FUNCTION TEST & ELECTROLYTES") {
      return (
        <div className="grid w-full grid-cols-1 gap-4">
          <div className="grid grid-cols-5 gap-4 items-center">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {"Name"}
              </label>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {"Data"}
              </div>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {'Reference range'}
              </div>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {'Unit'}
              </div>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {'Comments'}
              </div>
            </div>
          {[
            { label: "Urea", data: data.renalfunctiontests_and_electrolytes.urea, rr: data.renalfunctiontests_and_electrolytes.urea_reference_range, unit: data.renalfunctiontests_and_electrolytes.urea_unit, comments: data.renalfunctiontests_and_electrolytes.urea_comments },
            { label: "BUN", data: data.renalfunctiontests_and_electrolytes.bun, rr: data.renalfunctiontests_and_electrolytes.bun_reference_range, unit: data.renalfunctiontests_and_electrolytes.bun_unit, comments: data.renalfunctiontests_and_electrolytes.bun_comments },
            { label: "Calcium", data: data.renalfunctiontests_and_electrolytes.calcium, rr: data.renalfunctiontests_and_electrolytes.calcium_reference_range, unit: data.renalfunctiontests_and_electrolytes.calcium_unit, comments: data.renalfunctiontests_and_electrolytes.calcium_comments },
            { label: "Sodium", data: data.renalfunctiontests_and_electrolytes.sodium, rr: data.renalfunctiontests_and_electrolytes.sodium_reference_range, unit: data.renalfunctiontests_and_electrolytes.sodium_unit, comments: data.renalfunctiontests_and_electrolytes.sodium_comments },
            { label: "Potassium", data: data.renalfunctiontests_and_electrolytes.potassium, rr: data.renalfunctiontests_and_electrolytes.potassium_reference_range, unit: data.renalfunctiontests_and_electrolytes.potassium_unit, comments: data.renalfunctiontests_and_electrolytes.potassium_comments },
            { label: "Phosphorus", data: data.renalfunctiontests_and_electrolytes.phosphorus, rr: data.renalfunctiontests_and_electrolytes.phosphorus_reference_range, unit: data.renalfunctiontests_and_electrolytes.phosphorus_unit, comments: data.renalfunctiontests_and_electrolytes.phosphorus_comments },
            { label: "Serum Creatinine", data: data.renalfunctiontests_and_electrolytes.serumCreatinine, rr: data.renalfunctiontests_and_electrolytes.serumCreatinine_reference_range, unit: data.renalfunctiontests_and_electrolytes.serumCreatinine_unit, comments: data.renalfunctiontests_and_electrolytes.serumCreatinine_comments },
            { label: "Uric Acid", data: data.renalfunctiontests_and_electrolytes.uricAcid, rr: data.renalfunctiontests_and_electrolytes.uricAcid_reference_range, unit: data.renalfunctiontests_and_electrolytes.uricAcid_unit, comments: data.renalfunctiontests_and_electrolytes.uricAcid_comments },
            { label: "Chloride", data: data.renalfunctiontests_and_electrolytes.chloride, rr: data.renalfunctiontests_and_electrolytes.chloride_reference_range, unit: data.renalfunctiontests_and_electrolytes.chloride_unit, comments: data.renalfunctiontests_and_electrolytes.chloride_comments },
          ].map((item, index) => (
            <div key={index} className="grid grid-cols-5 gap-4 items-center">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {item.label}
              </label>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                {item.data || 'No data'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                {item.rr || 'No reference range'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                {item.unit || 'No unit'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                {item.comments || 'No comments'}
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    

    if (selectedInvestigation === "LIPID PROFILE") {
  return (
    <div className="grid w-full grid-cols-1 gap-4">
      <div className="grid grid-cols-5 gap-4 items-center">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {"Name"}
              </label>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {"Data"}
              </div>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {'Reference range'}
              </div>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {'Unit'}
              </div>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {'Comments'}
              </div>
            </div>
      {[
        { label: "Total Cholesterol", data: data.lipidProfile.totalCholesterol, rr: data.lipidProfile.totalCholesterol_reference_range, unit: data.lipidProfile.totalCholesterol_unit, comments: data.lipidProfile.totalCholesterol_comments },
        { label: "Triglycerides", data: data.lipidProfile.triglycerides, rr: data.lipidProfile.triglycerides_reference_range, unit: data.lipidProfile.triglycerides_unit, comments: data.lipidProfile.triglycerides_comments },
        { label: "HDL - Cholesterol", data: data.lipidProfile.hdlCholesterol, rr: data.lipidProfile.hdlCholesterol_reference_range, unit: data.lipidProfile.hdlCholesterol_unit, comments: data.lipidProfile.hdlCholesterol_comments },
        { label: "LDL - Cholesterol", data: data.lipidProfile.ldlCholesterol, rr: data.lipidProfile.ldlCholesterol_reference_range, unit: data.lipidProfile.ldlCholesterol_unit, comments: data.lipidProfile.ldlCholesterol_comments },
        { label: "CHOL HDL Ratio", data: data.lipidProfile.cholHdlRatio, rr: data.lipidProfile.cholHdlRatio_reference_range, unit: data.lipidProfile.cholHdlRatio_unit, comments: data.lipidProfile.cholHdlRatio_comments },
        { label: "VLDL - Cholesterol", data: data.lipidProfile.vldlCholesterol, rr: data.lipidProfile.vldlCholesterol_reference_range, unit: data.lipidProfile.vldlCholesterol_unit, comments: data.lipidProfile.vldlCholesterol_comments },
        { label: "LDL/HDL Ratio", data: data.lipidProfile.ldlHdlRatio, rr: data.lipidProfile.ldlHdlRatio_reference_range, unit: data.lipidProfile.ldlHdlRatio_unit, comments: data.lipidProfile.ldlHdlRatio_comments },
      ].map((item, index) => (
        <div key={index} className="grid grid-cols-5 gap-4 items-center">
          <label className="text-gray-700 font-medium text-sm md:text-base">
            {item.label}
          </label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
            {item.data || 'No data'}
          </div>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
            {item.rr || 'No reference range'}
          </div>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
            {item.unit || 'No unit'}
          </div>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
            {item.comments || 'No comments'}
          </div>
        </div>
      ))}
    </div>
  );
}

    

    if (selectedInvestigation === "LIVER FUNCTION TEST") {
  return (
    <div className="grid w-full grid-cols-1 gap-4">
      <div className="grid grid-cols-5 gap-4 items-center">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {"Name"}
              </label>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {"Data"}
              </div>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {'Reference range'}
              </div>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {'Unit'}
              </div>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {'Comments'}
              </div>
            </div>
      {[
        { label: "Bilirubin - Total", data: data.liverFunctionTest.bilirubinTotal, rr: data.liverFunctionTest.bilirubinTotal_reference_range, unit: data.liverFunctionTest.bilirubinTotal_unit, comments: data.liverFunctionTest.bilirubinTotal_comments },
        { label: "Bilirubin - Direct", data: data.liverFunctionTest.bilirubinDirect, rr: data.liverFunctionTest.bilirubinDirect_reference_range, unit: data.liverFunctionTest.bilirubinDirect_unit, comments: data.liverFunctionTest.bilirubinDirect_comments },
        { label: "Bilirubin - Indirect", data: data.liverFunctionTest.bilirubinIndirect, rr: data.liverFunctionTest.bilirubinIndirect_reference_range, unit: data.liverFunctionTest.bilirubinIndirect_unit, comments: data.liverFunctionTest.bilirubinIndirect_comments },
        { label: "SGOT / AST", data: data.liverFunctionTest.sgotAst, rr: data.liverFunctionTest.sgotAst_reference_range, unit: data.liverFunctionTest.sgotAst_unit, comments: data.liverFunctionTest.sgotAst_comments },
        { label: "SGPT / ALT", data: data.liverFunctionTest.sgptAlt, rr: data.liverFunctionTest.sgptAlt_reference_range, unit: data.liverFunctionTest.sgptAlt_unit, comments: data.liverFunctionTest.sgptAlt_comments },
        { label: "Alkaline Phosphatase", data: data.liverFunctionTest.alkalinePhosphatase, rr: data.liverFunctionTest.alkalinePhosphatase_reference_range, unit: data.liverFunctionTest.alkalinePhosphatase_unit, comments: data.liverFunctionTest.alkalinePhosphatase_comments },
        { label: "Total Protein", data: data.liverFunctionTest.totalProtein, rr: data.liverFunctionTest.totalProtein_reference_range, unit: data.liverFunctionTest.totalProtein_unit, comments: data.liverFunctionTest.totalProtein_comments },
        { label: "Albumin (Serum)", data: data.liverFunctionTest.albuminSerum, rr: data.liverFunctionTest.albuminSerum_reference_range, unit: data.liverFunctionTest.albuminSerum_unit, comments: data.liverFunctionTest.albuminSerum_comments },
        { label: "Globulin (Serum)", data: data.liverFunctionTest.globulinSerum, rr: data.liverFunctionTest.globulinSerum_reference_range, unit: data.liverFunctionTest.globulinSerum_unit, comments: data.liverFunctionTest.globulinSerum_comments },
        { label: "Alb/Glob Ratio", data: data.liverFunctionTest.albGlobRatio, rr: data.liverFunctionTest.albGlobRatio_reference_range, unit: data.liverFunctionTest.albGlobRatio_unit, comments: data.liverFunctionTest.albGlobRatio_comments },
        { label: "Gamma Glutamyl Transferase", data: data.liverFunctionTest.gammaGlutamylTransferase, rr: data.liverFunctionTest.gammaGlutamylTransferase_reference_range, unit: data.liverFunctionTest.gammaGlutamylTransferase_unit, comments: data.liverFunctionTest.gammaGlutamylTransferase_comments },
      ].map((item, index) => (
        <div key={index} className="grid grid-cols-5 gap-4 items-center">
          <label className="text-gray-700 font-medium text-sm md:text-base">
            {item.label}
          </label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
            {item.data || 'No data'}
          </div>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
            {item.rr || 'No reference range'}
          </div>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
            {item.unit || 'No unit'}
          </div>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
            {item.comments || 'No comments'}
          </div>
        </div>
      ))}
    </div>
  );
}

    
if (selectedInvestigation === "THYROID FUNCTION TEST") {
  return (
    <div className="grid w-full grid-cols-1 gap-4">
      <div className="grid grid-cols-5 gap-4 items-center">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {"Name"}
              </label>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {"Data"}
              </div>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {'Reference range'}
              </div>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {'Unit'}
              </div>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {'Comments'}
              </div>
            </div>
      {[
        { label: "T3 - Triiodothyronine", data: data.thyroidFunctionTest.t3_triiodothyronine, rr: data.thyroidFunctionTest.t3_reference_range, unit: data.thyroidFunctionTest.t3_unit, comments: data.thyroidFunctionTest.t3_comments },
        { label: "T4 - Thyroxine", data: data.thyroidFunctionTest.t4_thyroxine, rr: data.thyroidFunctionTest.t4_reference_range, unit: data.thyroidFunctionTest.t4_unit, comments: data.thyroidFunctionTest.t4_comments },
        { label: "TSH - Thyroid Stimulating Hormone", data: data.thyroidFunctionTest.tsh_thyroid_stimulating_hormone, rr: data.thyroidFunctionTest.tsh_reference_range, unit: data.thyroidFunctionTest.tsh_unit, comments: data.thyroidFunctionTest.tsh_comments },
      ].map((item, index) => (
        <div key={index} className="grid grid-cols-5 gap-4 items-center">
          <label className="text-gray-700 font-medium text-sm md:text-base">
            {item.label}
          </label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
            {item.data || 'No data'}
          </div>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
            {item.rr || 'No reference range'}
          </div>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
            {item.unit || 'No unit'}
          </div>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
            {item.comments || 'No comments'}
          </div>
        </div>
      ))}
    </div>
  );
}


    
    // if (selectedInvestigation === "AUTOIMMUNE TEST") {
    //   return (
    //     <div className="grid grid-cols-1 gap-4">
    //       {[
    //         { label: "ANA (Antinuclear Antibody)", data: data.autoimmuneTest.ana },
    //         { label: "Anti ds DNA", data: data.autoimmuneTest.antiDsDna },
    //         { label: "Anticardiolipin Antibodies (IgG & IgM)", data: data.autoimmuneTest.anticardiolipin },
    //         { label: "Rheumatoid Factor", data: data.autoimmuneTest.rheumatoidFactor },
    //       ].map((item, index) => (
    //         <div key={index} className="grid grid-cols-4 gap-4 items-center">
    //           <label className="text-gray-700 font-medium text-sm md:text-base">
    //             {item.label}
    //           </label>
    //           <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
    //             {item.data || 'No data available'}
    //           </div>
    //           <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
    //             {item.data || 'No data available'}
    //           </div>
    //           <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
    //             {item.data || 'No data available'}
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   );
    // }
    

    if (selectedInvestigation === "COAGULATION TEST") {
      return (
        <div className="grid w-full grid-cols-1 gap-4">
          <div className="grid grid-cols-5 gap-4 items-center">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {"Name"}
              </label>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {"Data"}
              </div>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {'Reference range'}
              </div>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {'Unit'}
              </div>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {'Comments'}
              </div>
            </div>
          {[
            { label: "Prothrombin Time (PT)", data: data.coagulationtest.prothrombin_time, unit: data.coagulationtest.prothrombin_time_unit, ref: data.coagulationtest.prothrombin_time_reference_range, comments: data.coagulationtest.prothrombin_time_comments },
            { label: "PT INR", data: data.coagulationtest.pt_inr, unit: data.coagulationtest.pt_inr_unit, ref: data.coagulationtest.pt_inr_reference_range, comments: data.coagulationtest.pt_inr_comments },
            { label: "Clotting Time (CT)", data: data.coagulationtest.clotting_time, unit: data.coagulationtest.clotting_time_unit, ref: data.coagulationtest.clotting_time_reference_range, comments: data.coagulationtest.clotting_time_comments },
            { label: "Bleeding Time (BT)", data: data.coagulationtest.bleeding_time, unit: data.coagulationtest.bleeding_time_unit, ref: data.coagulationtest.bleeding_time_reference_range, comments: data.coagulationtest.bleeding_time_comments },
          ].map((item, index) => (
            <div key={index} className="grid grid-cols-5 gap-4 items-center">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {item.label}
              </label>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                {item.data || 'No data'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                {item.unit || 'No unit'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                {item.ref || 'No reference range'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                {item.comments || 'No comments'}
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    

    if (selectedInvestigation === "ENZYMES & CARDIAC Profile") {
      return (
        <div className="grid w-full grid-cols-1 gap-4">
          <div className="grid grid-cols-5 gap-4 items-center">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {"Name"}
              </label>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {"Data"}
              </div>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {'Reference range'}
              </div>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {'Unit'}
              </div>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {'Comments'}
              </div>
            </div>
          {[
            { label: "Acid Phosphatase", data: data.enzymesandcardiacprofile.acid_phosphatase, unit: data.enzymesandcardiacprofile.acid_phosphatase_unit, ref: data.enzymesandcardiacprofile.acid_phosphatase_reference_range, comments: data.enzymesandcardiacprofile.acid_phosphatase_comments },
            { label: "Adenosine Deaminase", data: data.enzymesandcardiacprofile.adenosine_deaminase, unit: data.enzymesandcardiacprofile.adenosine_deaminase_unit, ref: data.enzymesandcardiacprofile.adenosine_deaminase_reference_range, comments: data.enzymesandcardiacprofile.adenosine_deaminase_comments },
            { label: "Amylase", data: data.enzymesandcardiacprofile.amylase, unit: data.enzymesandcardiacprofile.amylase_unit, ref: data.enzymesandcardiacprofile.amylase_reference_range, comments: data.enzymesandcardiacprofile.amylase_comments },
            { label: "ECG", data: data.enzymesandcardiacprofile.ecg, unit: data.enzymesandcardiacprofile.ecg_unit, ref: data.enzymesandcardiacprofile.ecg_reference_range, comments: data.enzymesandcardiacprofile.ecg_comments },
            { label: "Troponin-T", data: data.enzymesandcardiacprofile.troponin_t, unit: data.enzymesandcardiacprofile.troponin_t_unit, ref: data.enzymesandcardiacprofile.troponin_t_reference_range, comments: data.enzymesandcardiacprofile.troponin_t_comments },
            { label: "CPK - TOTAL", data: data.enzymesandcardiacprofile.cpk_total, unit: data.enzymesandcardiacprofile.cpk_total_unit, ref: data.enzymesandcardiacprofile.cpk_total_reference_range, comments: data.enzymesandcardiacprofile.cpk_total_comments },
            { label: "ECHO", data: data.enzymesandcardiacprofile.echo, unit: data.enzymesandcardiacprofile.echo_unit, ref: data.enzymesandcardiacprofile.echo_reference_range, comments: data.enzymesandcardiacprofile.echo_comments },
            { label: "Lipase", data: data.enzymesandcardiacprofile.lipase, unit: data.enzymesandcardiacprofile.lipase_unit, ref: data.enzymesandcardiacprofile.lipase_reference_range, comments: data.enzymesandcardiacprofile.lipase_comments },
            { label: "CPK - MB", data: data.enzymesandcardiacprofile.cpk_mb, unit: data.enzymesandcardiacprofile.cpk_mb_unit, ref: data.enzymesandcardiacprofile.cpk_mb_reference_range, comments: data.enzymesandcardiacprofile.cpk_mb_comments },
            { label: "TMT", data: data.enzymesandcardiacprofile.tmt_normal, unit: data.enzymesandcardiacprofile.tmt_normal_unit, ref: data.enzymesandcardiacprofile.tmt_normal_reference_range, comments: data.enzymesandcardiacprofile.tmt_normal_comments },
          ].map((item, index) => (
            <div key={index} className="grid grid-cols-5 gap-4 items-center">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {item.label}
              </label>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                {item.data || 'No data'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                {item.unit || 'No unit'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                {item.ref || 'No reference range'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                {item.comments || 'No comments'}
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    
    // if (selectedInvestigation === "URINE ROUTINE") {
    //   return (
    //     <div className="grid grid-cols-1 gap-4">
    //       {[
    //         { label: "Colour", data: data.urineRoutine.colour },
    //         { label: "Appearance", data: data.urineRoutine.appearance },
    //         { label: "Reaction (pH)", data: data.urineRoutine.reactionPH },
    //         { label: "Specific gravity", data: data.urineRoutine.specificGravity },
    //         { label: "Crystals", data: data.urineRoutine.crystals },
    //         { label: "Bacteria", data: data.urineRoutine.bacteria },
    //         { label: "Protein/Albumin", data: data.urineRoutine.proteinAlbumin },
    //         { label: "Glucose (Urine)", data: data.urineRoutine.glucoseUrine },
    //         { label: "Ketone Bodies", data: data.urineRoutine.ketoneBodies },
    //         { label: "Urobilinogen", data: data.urineRoutine.urobilinogen },
    //         { label: "Casts", data: data.urineRoutine.casts },
    //         { label: "Bile Salts", data: data.urineRoutine.bileSalts },
    //         { label: "Bile Pigments", data: data.urineRoutine.bilePigments },
    //         { label: "WBC / Pus cells", data: data.urineRoutine.wbcPusCells },
    //         { label: "Red Blood Cells", data: data.urineRoutine.redBloodCells },
    //         { label: "Epithelial cells", data: data.urineRoutine.epithelialCells },
    //       ].map((item, index) => (
    //         <div key={index} className="grid grid-cols-4 gap-4 items-center">
    //           <label className="text-gray-700 font-medium text-sm md:text-base">
    //             {item.label}
    //           </label>
    //           <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
    //             {item.data || 'No data available'}
    //           </div>
    //           <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
    //             {item.data || 'No data available'}
    //           </div>
    //           <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
    //             {item.data || 'No data available'}
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   );
    // }
    

    if (selectedInvestigation === "SEROLOGY") {
      return (
        <div className="grid w-full grid-cols-1 gap-4">
          <div className="grid grid-cols-5 gap-4 items-center">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {"Name"}
              </label>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {"Data"}
              </div>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {'Reference range'}
              </div>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {'Unit'}
              </div>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {'Comments'}
              </div>
            </div>
          {[
            { label: "Screening For HIV I & II", data: data.serology.screening_hiv, unit: data.serology.screening_hiv_unit, ref: data.serology.screening_hiv_reference_range, comments: data.serology.screening_hiv_comments },
            { label: "HBsAg", data: data.serology.hbsAg, unit: data.serology.hbsAg_unit, ref: data.serology.hbsAg_reference_range, comments: data.serology.hbsAg_comments },
            { label: "HCV", data: data.serology.hcv, unit: data.serology.hcv_unit, ref: data.serology.hcv_reference_range, comments: data.serology.hcv_comments },
            { label: "VDRL", data: data.serology.vdrl, unit: data.serology.vdrl_unit, ref: data.serology.vdrl_reference_range, comments: data.serology.vdrl_comments },
            { label: "Dengue NS1Ag", data: data.serology.dengueNS1Ag, unit: data.serology.dengueNS1Ag_unit, ref: data.serology.dengueNS1Ag_reference_range, comments: data.serology.dengueNS1Ag_comments },
            { label: "Dengue IgG", data: data.serology.dengueIgG, unit: data.serology.dengueIgG_unit, ref: data.serology.dengueIgG_reference_range, comments: data.serology.dengueIgG_comments },
            { label: "Dengue IgM", data: data.serology.dengueIgM, unit: data.serology.dengueIgM_unit, ref: data.serology.dengueIgM_reference_range, comments: data.serology.dengueIgM_comments },
            { label: "WIDAL", data: data.serology.widal, unit: data.serology.widal_unit, ref: data.serology.widal_reference_range, comments: data.serology.widal_comments },
          ].map((item, index) => (
            <div key={index} className="grid grid-cols-5 gap-4 items-center">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {item.label}
              </label>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                {item.data || 'No data'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                {item.unit || 'No unit'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                {item.ref || 'No reference range'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                {item.comments || 'No comments'}
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    

    if (selectedInvestigation === "MOTION") {
      return (
        <div className="grid w-full grid-cols-1 gap-4">
          <div className="grid grid-cols-5 gap-4 items-center">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {"Name"}
              </label>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {"Data"}
              </div>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {'Reference range'}
              </div>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {'Unit'}
              </div>
              <div className="text-gray-700 font-medium text-sm md:text-base ms-4">
                {'Comments'}
              </div>
            </div>
          {[
            { label: "Colour (Motion)", data: data.motion.colour_motion, unit: data.motion.colour_motion_unit, ref: data.motion.colour_motion_reference_range, comments: data.motion.colour_motion_comments },
            { label: "Appearance (Motion)", data: data.motion.appearance_motion, unit: data.motion.appearance_motion_unit, ref: data.motion.appearance_motion_reference_range, comments: data.motion.appearance_motion_comments },
            { label: "Occult Blood", data: data.motion.occult_blood, unit: data.motion.occult_blood_unit, ref: data.motion.occult_blood_reference_range, comments: data.motion.occult_blood_comments },
            { label: "Cyst", data: data.motion.cyst, unit: data.motion.cyst_unit, ref: data.motion.cyst_reference_range, comments: data.motion.cyst_comments },
            { label: "Mucus", data: data.motion.mucus, unit: data.motion.mucus_unit, ref: data.motion.mucus_reference_range, comments: data.motion.mucus_comments },
            { label: "Pus Cells", data: data.motion.pus_cells, unit: data.motion.pus_cells_unit, ref: data.motion.pus_cells_reference_range, comments: data.motion.pus_cells_comments },
            { label: "Ova", data: data.motion.ova, unit: data.motion.ova_unit, ref: data.motion.ova_reference_range, comments: data.motion.ova_comments },
            { label: "RBCs", data: data.motion.rbcs, unit: data.motion.rbcs_unit, ref: data.motion.rbcs_reference_range, comments: data.motion.rbcs_comments },
            { label: "Others", data: data.motion.others, unit: data.motion.others_unit, ref: data.motion.others_reference_range, comments: data.motion.others_comments },
          ].map((item, index) => (
            <div key={index} className="grid grid-cols-5 gap-4 items-center">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {item.label}
              </label>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                {item.data || 'No data'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                {item.unit || 'No unit'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                {item.ref || 'No reference range'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                {item.comments || 'No comments'}
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    
    // if (selectedInvestigation === "ROUTINE CULTURE & SENSITIVITY TEST") {
    //   return (
    //     <div className="grid grid-cols-1 gap-4">
    //       {["Urine", "Motion", "Sputum", "Blood"].map((label, index) => (
    //         <div key={index} className="grid grid-cols-4 gap-4 items-center">
    //           <label className="text-gray-700 font-medium text-sm md:text-base">
    //             {label}
    //           </label>
    //           <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
    //             {data.data || 'No data available'}
    //           </div>
    //           <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
    //             {data.data || 'No data available'}
    //           </div>
    //           <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
    //             {data.data || 'No data available'}
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   );
    // }
    
    if (selectedInvestigation === "Men's Pack") {
      return (
        <div className="grid grid-cols-1 gap-4">
          {[
            {
              label: "PSA (Prostate Specific Antigen)",
              data: data.mensPack.psa,
              unit: data.mensPack.psa_unit,
              ref: data.mensPack.psa_reference_range,
              comments: data.mensPack.psa_comments,
            },
          ].map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 items-center">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {item.label}
              </label>
              <input
                type="text"
                placeholder="Unit (in %) or ng/ml"
                className="p-2 border border-gray-300 rounded text-sm md:text-base w-full"
              />
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                {item.data || 'No data available'}
              </div>
              <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                {item.ref || 'No reference range'}
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    
    // if (selectedInvestigation === "Women's Pack") {
    //   return (
    //     <div className="space-y-4">
    //       {[
    //         { label: "Mammogram", options: ["Normal", "Abnormal"] },
    //         { label: "PAP Smear", options: ["Normal", "Abnormal"] },
    //       ].map((item, index) => (
    //         <div key={index} className="space-y-2">
    //           <label className="text-gray-700 font-medium text-sm md:text-base">
    //             {item.label}
    //           </label>
    //           <select className="p-2 border border-gray-300 rounded text-sm md:text-base w-full">
    //             <option value="">Select Result</option>
    //             {item.options.map((option, i) => (
    //               <option key={i} value={option}>
    //                 {option}
    //               </option>
    //             ))}
    //           </select>
    //         </div>
    //       ))}
    //     </div>
    //   );
    // }
    
    // if (selectedInvestigation === "Occupational Profile") {
    //   return (
    //     <div className="space-y-4">
    //       {[
    //         { label: "Audiometry", options: ["Normal", "Abnormal"] },
    //         { label: "PFT", options: ["Normal", "Abnormal"] },
    //       ].map((item, index) => (
    //         <div key={index} className="space-y-2">
    //           <label className="text-gray-700 font-medium text-sm md:text-base">
    //             {item.label}
    //           </label>
    //           <select className="p-2 border border-gray-300 rounded text-sm md:text-base w-full">
    //             <option value="">Select Result</option>
    //             {item.options.map((option, i) => (
    //               <option key={i} value={option}>
    //                 {option}
    //               </option>
    //             ))}
    //           </select>
    //         </div>
    //       ))}
    //     </div>
    //   );
    // }
    
    // if (selectedInvestigation === "Others TEST") {
    //   return (
    //     <div className="space-y-4">
    //       {[
    //         { label: "Pathology", options: ["Normal", "Abnormal"] },
    //       ].map((item, index) => (
    //         <div key={index} className="space-y-2">
    //           <label className="text-gray-700 font-medium text-sm md:text-base">
    //             {item.label}
    //           </label>
    //           <select className="p-2 border border-gray-300 rounded text-sm md:text-base w-full">
    //             <option value="">Select Result</option>
    //             {item.options.map((option, i) => (
    //               <option key={i} value={option}>
    //                 {option}
    //               </option>
    //             ))}
    //           </select>
    //         </div>
    //       ))}
    //     </div>
    //   );
    // }
    
    if (selectedInvestigation === "OPHTHALMIC REPORT") {
      return (
        <div className="space-y-4">
          {[
            {
              label: "Vision",
              data: data.opthalamicreport.vision,
              unit: data.opthalamicreport.vision_unit,
              ref: data.opthalamicreport.vision_reference_range,
              comments: data.opthalamicreport.vision_comments,
              options: ["Normal", "Abnormal"],
            },
            {
              label: "Color Vision",
              data: data.opthalamicreport.color_vision,
              unit: data.opthalamicreport.color_vision_unit,
              ref: data.opthalamicreport.color_vision_reference_range,
              comments: data.opthalamicreport.color_vision_comments,
              options: ["Normal", "Abnormal"],
            },
          ].map((item, index) => (
            <div key={index} className="space-y-2">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {item.label}
              </label>
              <select className="p-2 border border-gray-300 rounded text-sm md:text-base w-full">
                <option value="">Select Result</option>
                {item.options.map((option, i) => (
                  <option key={i} value={option} selected={option === item.data}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-3 gap-4">
                <div className="px-4 py-2 bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                  {item.data || 'No data available'}
                </div>
                <div className="px-4 py-2 bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                  {item.ref || 'No reference range'}
                </div>
                <div className="px-4 py-2 bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                  {item.comments || 'No comments'}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    
    // if (selectedInvestigation === "X-RAY") {
    //   return (
    //     <div className="space-y-4">
    //       {[
    //         { label: "X-RAY Chest", options: ["Normal", "Abnormal"] },
    //         { label: "X-RAY KUB", options: ["Normal", "Abnormal"] },
    //         { label: "X-RAY Spine", options: ["Normal", "Abnormal"] },
    //         { label: "X-RAY Pelvis", options: ["Normal", "Abnormal"] },
    //         { label: "X-RAY Abdomen", options: ["Normal", "Abnormal"] },
    //       ].map((item, index) => (
    //         <div key={index} className="space-y-2">
    //           <label className="text-gray-700 font-medium text-sm md:text-base">
    //             {item.label}
    //           </label>
    //           <select className="p-2 border border-gray-300 rounded text-sm md:text-base w-full">
    //             <option value="">Select Result</option>
    //             {item.options.map((option, i) => (
    //               <option key={i} value={option}>
    //                 {option}
    //               </option>
    //             ))}
    //           </select>
    //         </div>
    //       ))}
    //     </div>
    //   );
    // }
    
    if (selectedInvestigation === "USG") {
      return (
        <div className="space-y-4">
          {[
            {
              label: "USG Abdomen",
              data: data.usg_abdomen,
              unit: data.usg_abdomen_unit,
              ref: data.usg_abdomen_reference_range,
              comments: data.usg_abdomen_comments,
              options: ["Normal", "Abnormal"],
            },
            {
              label: "USG KUB",
              data: data.usg_kub,
              unit: data.usg_kub_unit,
              ref: data.usg_kub_reference_range,
              comments: data.usg_kub_comments,
              options: ["Normal", "Abnormal"],
            },
            {
              label: "USG Pelvis",
              data: data.usg_pelvis,
              unit: data.usg_pelvis_unit,
              ref: data.usg_pelvis_reference_range,
              comments: data.usg_pelvis_comments,
              options: ["Normal", "Abnormal"],
            },
            {
              label: "USG Neck",
              data: data.usg_neck,
              unit: data.usg_neck_unit,
              ref: data.usg_neck_reference_range,
              comments: data.usg_neck_comments,
              options: ["Normal", "Abnormal"],
            },
          ].map((item, index) => (
            <div key={index} className="space-y-2">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {item.label}
              </label>
              <select className="p-2 border border-gray-300 rounded text-sm md:text-base w-full">
                <option value="">Select Result</option>
                {item.options.map((option, i) => (
                  <option key={i} value={option} selected={option === item.data}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-3 gap-4">
                <div className="px-4 py-2 bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                  {item.data || 'No data available'}
                </div>
                <div className="px-4 py-2 bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                  {item.ref || 'No reference range'}
                </div>
                <div className="px-4 py-2 bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                  {item.comments || 'No comments'}
                </div>
              </div>
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
            {
              label: "MRI Brain",
              data: data.mri_brain,
              unit: data.mri_brain_unit,
              ref: data.mri_brain_reference_range,
              comments: data.mri_brain_comments,
              options: ["Normal", "Abnormal"],
            },
            {
              label: "MRI Spine",
              data: data.mri_spine,
              unit: data.mri_spine_unit,
              ref: data.mri_spine_reference_range,
              comments: data.mri_spine_comments,
              options: ["Normal", "Abnormal"],
            },
            {
              label: "MRI Abdomen",
              data: data.mri_abdomen,
              unit: data.mri_abdomen_unit,
              ref: data.mri_abdomen_reference_range,
              comments: data.mri_abdomen_comments,
              options: ["Normal", "Abnormal"],
            },
            {
              label: "MRI Pelvis",
              data: data.mri_pelvis,
              unit: data.mri_pelvis_unit,
              ref: data.mri_pelvis_reference_range,
              comments: data.mri_pelvis_comments,
              options: ["Normal", "Abnormal"],
            },
          ].map((item, index) => (
            <div key={index} className="space-y-2">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                {item.label}
              </label>
              <select className="p-2 border border-gray-300 rounded text-sm md:text-base w-full">
                <option value="">Select Result</option>
                {item.options.map((option, i) => (
                  <option key={i} value={option} selected={option === item.data}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-3 gap-4">
                <div className="px-4 py-2 bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                  {item.data || 'No data available'}
                </div>
                <div className="px-4 py-2 bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                  {item.ref || 'No reference range'}
                </div>
                <div className="px-4 py-2 bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
                  {item.comments || 'No comments'}
                </div>
              </div>
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
        <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Select Investigation Form</h2>
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