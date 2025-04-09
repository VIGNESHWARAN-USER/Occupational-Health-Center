// FitnessPageDisplay.jsx
import React, { useEffect, useState } from "react";
import moment from 'moment'; // Import moment

// --- Reusable Detail Item Component ---
const DetailItem = ({ label, value, isFullWidth = false }) => (
    <div className={isFullWidth ? "md:col-span-3" : ""}> {/* Span full width on medium screens if needed */}
        <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        <div className="px-3 py-2 w-full bg-gray-50 border border-gray-200 rounded-md shadow-sm text-gray-800 text-sm min-h-[38px] flex items-center">
            {value !== null && value !== undefined && value !== '' ? value : <span className="text-gray-400 italic">N/A</span>}
        </div>
    </div>
);

// --- Display Component for Form 17 ---
const RenderForm17Display = ({ formData }) => {
    if (!formData) return null;
    return (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-blue-800 border-b pb-2">Form 17 Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <DetailItem label="Dept" value={formData.dept} />
                <DetailItem label="Works Number" value={formData.worksNumber} />
                <DetailItem label="Worker Name" value={formData.workerName} />
                <DetailItem label="Sex" value={formData.sex} />
                <DetailItem label="Date of Birth" value={formData.dob ? moment(formData.dob).format('LL') : 'N/A'} />
                <DetailItem label="Age" value={formData.age} />
                <DetailItem label="Employment Date" value={formData.employmentDate ? moment(formData.employmentDate).format('LL') : 'N/A'} />
                <DetailItem label="Leaving Date" value={formData.leavingDate ? moment(formData.leavingDate).format('LL') : 'N/A'} />
                <DetailItem label="Reason" value={formData.reason} />
                <DetailItem label="Transferred To" value={formData.transferredTo} />
                <DetailItem label="Job Nature" value={formData.jobNature} />
                <DetailItem label="Raw Material" value={formData.rawMaterial} />
                <DetailItem label="Medical Exam Date" value={formData.medicalExamDate ? moment(formData.medicalExamDate).format('LL') : 'N/A'} />
                <DetailItem label="Medical Exam Result" value={formData.medicalExamResult} />
                <DetailItem label="Suspension Details" value={formData.suspensionDetails} isFullWidth={true} />
                <DetailItem label="Recertified Date" value={formData.recertifiedDate ? moment(formData.recertifiedDate).format('LL') : 'N/A'} />
                <DetailItem label="Unfitness Certificate" value={formData.unfitnessCertificate} />
                {/* Signatures are often just names/timestamps in digital forms */}
                {/* <DetailItem label="Surgeon Signature Ref" value={formData.surgeonSignature} /> */}
                {/* <DetailItem label="FMO Signature Ref" value={formData.fmoSignature} /> */}
            </div>
        </div>
    );
};

// --- Display Component for Form 38 ---
const RenderForm38Display = ({ formData }) => {
    if (!formData) return null;
    return (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-green-800 border-b pb-2">Form 38 Details (Eye Exam)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <DetailItem label="Serial Number" value={formData.serialNumber} />
                <DetailItem label="Department/Workers" value={formData.department} />
                <DetailItem label="Worker Name" value={formData.workerName} />
                <DetailItem label="Sex" value={formData.sex} />
                <DetailItem label="Age" value={formData.age} />
                <DetailItem label="Nature of Job" value={formData.jobNature} />
                <DetailItem label="Date of Employment" value={formData.employmentDate ? moment(formData.employmentDate).format('LL') : 'N/A'} />
                <DetailItem label="Date of Eye Exam" value={formData.eyeExamDate ? moment(formData.eyeExamDate).format('LL') : 'N/A'} />
                <DetailItem label="Result" value={formData.result} />
                <DetailItem label="Remarks" value={formData.remarks} isFullWidth={true}/>
                {/* Signatures */}
                {/* <DetailItem label="Opthamologist Signature Ref" value={formData.opthamologistSignature} /> */}
                {/* <DetailItem label="FMO Signature Ref" value={formData.fmoSignature} /> */}
            </div>
        </div>
    );
};

// --- Display Component for Form 39 ---
const RenderForm39Display = ({ formData }) => {
    if (!formData) return null;
    return (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-yellow-800 border-b pb-2">Form 39 Details (Medical Exam Cert)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <DetailItem label="Serial Number" value={formData.serialNumber} />
                <DetailItem label="Worker Name" value={formData.workerName} />
                <DetailItem label="Sex" value={formData.sex} />
                <DetailItem label="Age" value={formData.age} />
                <DetailItem label="Date of Proposed Employment" value={formData.proposedEmploymentDate ? moment(formData.proposedEmploymentDate).format('LL') : 'N/A'} />
                <DetailItem label="Job Occupation" value={formData.jobOccupation} />
                <DetailItem label="Raw Material/Product Handled" value={formData.rawMaterialHandled} isFullWidth={true}/>
                <DetailItem label="Medical Exam Date" value={formData.medicalExamDate ? moment(formData.medicalExamDate).format('LL') : 'N/A'} />
                <DetailItem label="Result of Medical Examination" value={formData.medicalExamResult} />
                <DetailItem label="Certified Fit/Unfit/Conditional" value={formData.certifiedFit} />
                <DetailItem label="Dept/Section (If employed)" value={formData.departmentSection} />
                 {/* Signature */}
                {/* <DetailItem label="Certifying Surgeon Signature Ref" value={formData.certifyingSurgeonSignature} /> */}
            </div>
        </div>
    );
};

// --- Display Component for Form 40 ---
const RenderForm40Display = ({ formData }) => {
    if (!formData) return null;
    return (
        <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-purple-800 border-b pb-2">Form 40 Details (Health Register)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <DetailItem label="Serial Number" value={formData.serialNumber} />
                <DetailItem label="Date of Employment" value={formData.dateOfEmployment ? moment(formData.dateOfEmployment).format('LL') : 'N/A'} />
                <DetailItem label="Worker Name" value={formData.workerName} />
                <DetailItem label="Sex" value={formData.sex} />
                <DetailItem label="Age" value={formData.age} />
                <DetailItem label="Son/Wife/Daughter Of" value={formData.sonWifeDaughterOf} />
                <DetailItem label="Nature of Job" value={formData.natureOfJob} />
                <DetailItem label="Urine Result" value={formData.urineResult} />
                <DetailItem label="Blood Result" value={formData.bloodResult} />
                <DetailItem label="Feces Result" value={formData.fecesResult} />
                <DetailItem label="X-ray Result" value={formData.xrayResult} />
                <DetailItem label="Other Exam Result" value={formData.otherExamResult} />
                <DetailItem label="Deworming" value={formData.deworming} />
                <DetailItem label="Typhoid Vaccination Date" value={formData.typhoidVaccinationDate ? moment(formData.typhoidVaccinationDate).format('LL') : 'N/A'} />
                <DetailItem label="Remarks" value={formData.remarks} isFullWidth={true}/>
                 {/* Signature */}
                {/* <DetailItem label="Signature of FMO Ref" value={formData.signatureOfFMO} /> */}
            </div>
        </div>
    );
};

// --- Display Component for Form 27 ---
const RenderForm27Display = ({ formData }) => {
    if (!formData) return null;
    return (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-red-800 border-b pb-2">Form 27 Details (Fitness Cert - Adolescent)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <DetailItem label="Serial Number" value={formData.serialNumber} />
                <DetailItem label="Date" value={formData.date ? moment(formData.date).format('LL') : 'N/A'} />
                <DetailItem label="Department" value={formData.department} />
                <DetailItem label="Name of Works" value={formData.nameOfWorks} />
                <DetailItem label="Sex" value={formData.sex} />
                <DetailItem label="Age" value={formData.age} />
                <DetailItem label="Date of Birth" value={formData.dateOfBirth ? moment(formData.dateOfBirth).format('LL') : 'N/A'} />
                <DetailItem label="Name of the Father" value={formData.nameOfTheFather} />
                <DetailItem label="Nature of Job or Occupation" value={formData.natureOfJobOrOccupation} />
                <DetailItem label="Descriptive Marks" value={formData.descriptiveMarks} isFullWidth={true}/>
                 {/* Signatures */}
                {/* <DetailItem label="Signature of FMO Ref" value={formData.signatureOfFMO} /> */}
                {/* <DetailItem label="Signature of Certifying Surgeon Ref" value={formData.signatureOfCertifyingSurgeon} /> */}
            </div>
        </div>
    );
};


// --- Main Fitness Page Display Component ---
const Fitness = ({ data }) => {
  console.log(data);
  const fitnessAssessmentData = data.fitnessassessment;
  const [displayData, setDisplayData] = useState({
    tremors: "N/A",
    romberg_test: "N/A",
    acrophobia: "N/A",
    trendelenberg_test: "N/A",
    jobNature: [],
    conditionalFitFields: [],
    overallFitness: "N/A",
    comments: "N/A",
    validity: "N/A",
    form17: null, // Add state for each form
    form27: null,
    form38: null,
    form39: null,
    form40: null,
  });

  useEffect(() => {
    if (fitnessAssessmentData) {
        // Safely parse jobNature
        let parsedJobNature = [];
        if (fitnessAssessmentData.job_nature) {
            if (Array.isArray(fitnessAssessmentData.job_nature)) {
                parsedJobNature = fitnessAssessmentData.job_nature;
            } else if (typeof fitnessAssessmentData.job_nature === 'string') {
                try {
                    const parsed = JSON.parse(fitnessAssessmentData.job_nature);
                    if (Array.isArray(parsed)) {
                        parsedJobNature = parsed;
                    }
                } catch (error) {
                    console.error("Error parsing job_nature JSON:", error);
                    // Fallback: maybe split by comma if it's a simple string list?
                    // parsedJobNature = fitnessAssessmentData.job_nature.split(',').map(s => s.trim()).filter(Boolean);
                }
            }
        }

        // Safely parse conditionalFitFields
        let parsedConditionalFields = [];
         if (fitnessAssessmentData.conditional_fit_feilds) { // Note the potential typo 'feilds' vs 'fields'
            const fieldData = fitnessAssessmentData.conditional_fit_feilds;
             if (Array.isArray(fieldData)) {
                parsedConditionalFields = fieldData;
            } else if (typeof fieldData === 'string') {
                try {
                    const parsed = JSON.parse(fieldData);
                    if (Array.isArray(parsed)) {
                        parsedConditionalFields = parsed;
                    }
                } catch (error) {
                    console.error("Error parsing conditional_fit_feilds JSON:", error);
                    // Fallback option if needed
                }
            }
        }


      setDisplayData({
        tremors: fitnessAssessmentData.tremors || "N/A",
        romberg_test: fitnessAssessmentData.romberg_test || "N/A",
        acrophobia: fitnessAssessmentData.acrophobia || "N/A",
        trendelenberg_test: fitnessAssessmentData.trendelenberg_test || "N/A",
        jobNature: parsedJobNature,
        conditionalFitFields: parsedConditionalFields,
        overallFitness: fitnessAssessmentData.overall_fitness || "N/A",
        comments: fitnessAssessmentData.comments || "N/A",
        validity: fitnessAssessmentData.validity ? moment(fitnessAssessmentData.validity).format('LL') : "N/A",
        // Check for nested form data
        form17: data.form17 || null,
        form27: data.form27 || null,
        form38: data.form38 || null,
        form39: data.form39 || null,
        form40: data.form40 || null,
      });
    } else {
      // Handle case where fitnessAssessmentData is null/undefined
      setDisplayData({
        tremors: "N/A", romberg_test: "N/A", acrophobia: "N/A", trendelenberg_test: "N/A",
        jobNature: [], conditionalFitFields: [], overallFitness: "N/A", comments: "N/A", validity: "N/A",
        form17: null, form27: null, form38: null, form39: null, form40: null,
      });
    }
  }, [fitnessAssessmentData]); // Depend on the input prop

  return (
    <div className="mt-6 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Fitness Assessment Details</h2>

      {/* Basic Tests Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-6">
        <DetailItem label="Tremors" value={displayData.tremors} />
        <DetailItem label="Romberg Test" value={displayData.romberg_test} />
        <DetailItem label="Acrophobia" value={displayData.acrophobia} />
        <DetailItem label="Trendelenberg Test" value={displayData.trendelenberg_test} />
        <DetailItem label="Overall Fitness" value={displayData.overallFitness} />
        <DetailItem label="Validity Date" value={displayData.validity} />
      </div>

       {/* Job Nature Section */}
       <div className="mb-6">
           <h3 className="text-lg font-semibold mb-3 text-gray-700">Job Nature</h3>
           <div className="p-3 bg-gray-50 border border-gray-200 rounded-md shadow-sm min-h-[40px]">
               {displayData.jobNature && displayData.jobNature.length > 0 ? (
                   <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                       {displayData.jobNature.map((job, index) => (
                           <li key={index}>{job}</li>
                       ))}
                   </ul>
               ) : (
                   <p className="text-sm text-gray-500 italic">No job nature specified.</p>
               )}
           </div>
       </div>

      {/* Conditional Fit Fields Section (Only show if relevant) */}
      {displayData.overallFitness?.toLowerCase() === "conditional" && (
        <div className="mb-6">
           <h3 className="text-lg font-semibold mb-3 text-gray-700">Conditional Fit For</h3>
           <div className="p-3 bg-gray-50 border border-gray-200 rounded-md shadow-sm min-h-[40px]">
               {displayData.conditionalFitFields && displayData.conditionalFitFields.length > 0 ? (
                   <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                       {displayData.conditionalFitFields.map((field, index) => (
                           <li key={index}>{field}</li>
                       ))}
                   </ul>
               ) : (
                   <p className="text-sm text-gray-500 italic">No specific conditional fields listed.</p>
               )}
           </div>
       </div>
      )}

      {/* Comments Section */}
       <div className="mb-6">
           <h3 className="text-lg font-semibold mb-3 text-gray-700">Comments</h3>
            {/* Use DetailItem for consistency, allowing full width */}
           <DetailItem label="" value={displayData.comments} isFullWidth={true} />
       </div>

       {/* Statutory Forms Section */}
        {(displayData.form17 || displayData.form27 || displayData.form38 || displayData.form39 || displayData.form40) && (
             <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-3">Associated Statutory Forms</h2>
                <RenderForm17Display formData={displayData.form17} />
                <RenderForm38Display formData={displayData.form38} />
                <RenderForm39Display formData={displayData.form39} />
                <RenderForm40Display formData={displayData.form40} />
                <RenderForm27Display formData={displayData.form27} />
            </div>
        )}

    </div>
  );
};

export default Fitness;