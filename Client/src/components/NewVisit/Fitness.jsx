import React, { useState, useEffect } from "react";
import moment from 'moment';
import jsPDF from 'jspdf';
import SignificantNotes from "./SignificantNotes";

// URLs (Keep as is)
const FITNESS_ASSESSMENT_URL = "http://localhost:8000/fitness-tests/";
const FORM17_URL = "http://localhost:8000/form17/";
const FORM38_URL = "http://localhost:8000/form38/";
const FORM39_URL = "http://localhost:8000/form39/";
const FORM40_URL = "http://localhost:8000/form40/";
const FORM27_URL = "http://localhost:8000/form27/";

// Label Mappings (Keep as is)
const FORM17_LABELS = { /* ... */ };
const FORM38_LABELS = { /* ... */ };
const FORM39_LABELS = { /* ... */ };
const FORM40_LABELS = { /* ... */ };
const FORM27_LABELS = { /* ... */ };

// PDF Generation Function (Keep as is)
const generateFormPdf = (formData, formTitle, empNo, empName, fieldLabels) => { /* ... */ };

const FitnessPage = ({ data }) => {
    // Options (Keep as is)
    const allOptions = ["Height", "Gas Line", "Confined Space", "SCBA Rescue", "Fire Rescue"];
    const statutoryOptions = ["Select Form", "Form 17", "Form 38", "Form 39", "Form 40", "Form 27"];
    const eyeExamResultOptions = ["", "Normal", "Defective", "Color Blindness"];
    const eyeExamFitStatusOptions = [
        "", "Fit", "Fit when newly prescribed glass", "Fit with existing glass",
        "Fit with an advice to change existing glass with newly prescribed glass", "Unfit"
    ];

    // State (Keep as is, including new fields)
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [conditionalOptions, setConditionalOptions] = useState([]);
    const [overallFitness, setOverallFitness] = useState("");
    const [fitnessFormData, setFitnessFormData] = useState({
        emp_no: data?.[0]?.emp_no || '',
        tremors: "", romberg_test: "", acrophobia: "", trendelenberg_test: "",
    });
    const [systematicExamination, setSystematicExamination] = useState("");
    const [eyeExamResult, setEyeExamResult] = useState("");
    const [eyeExamFitStatus, setEyeExamFitStatus] = useState("");
    const [comments, setComments] = useState("");

    // Statutory Form States (Keep as is)
    const initialForm17State = { /* ... */ }; // (Ensure these have default values)
    const initialForm38State = { /* ... */ };
    const initialForm39State = { /* ... */ };
    const initialForm40State = { /* ... */ };
    const initialForm27State = { /* ... */ };
    const [form17Data, setForm17Data] = useState(initialForm17State);
    const [form38Data, setForm38Data] = useState(initialForm38State);
    const [form39Data, setForm39Data] = useState(initialForm39State);
    const [form40Data, setForm40Data] = useState(initialForm40State);
    const [form27Data, setForm27Data] = useState(initialForm27State);
    const [selectedStatutoryForms, setSelectedStatutoryForms] = useState([]);

    // useEffect (Keep as is, already handles loading/resetting new fields)
    useEffect(() => {
        // ... (useEffect logic remains the same)
        const currentEmpNo = data?.[0]?.emp_no || '';
        setFitnessFormData(prevState => ({ ...prevState, emp_no: currentEmpNo }));

        if (data && data[0]) {
            const assessmentData = data[0].fitnessassessment;
            if (assessmentData) {
                setFitnessFormData({ emp_no: assessmentData.emp_no || currentEmpNo, tremors: assessmentData.tremors || "", romberg_test: assessmentData.romberg_test || "", acrophobia: assessmentData.acrophobia || "", trendelenberg_test: assessmentData.trendelenberg_test || "", });
                let initialJobNature = []; try { if (assessmentData.job_nature) { const parsed = JSON.parse(assessmentData.job_nature); initialJobNature = Array.isArray(parsed) ? parsed : []; } } catch (e) { console.error("Error parsing job_nature:", e); } setSelectedOptions(initialJobNature);
                let initialConditionalOptions = []; try { if (assessmentData.conditional_fit_feilds) { const parsed = JSON.parse(assessmentData.conditional_fit_feilds); initialConditionalOptions = Array.isArray(parsed) ? parsed : []; } } catch (e) { console.warn("Could not parse conditional_fit_feilds:", e); } setConditionalOptions(initialConditionalOptions);
                setOverallFitness(assessmentData.overall_fitness || "");
                setComments(assessmentData.comments || "");
                setSystematicExamination(assessmentData.systematic_examination || "");
                setEyeExamResult(assessmentData.eye_exam_result || "");
                setEyeExamFitStatus(assessmentData.eye_exam_fit_status || "");
            } else {
                setFitnessFormData(prevState => ({ ...prevState, tremors: "", romberg_test: "", acrophobia: "", trendelenberg_test: "" }));
                setSelectedOptions([]); setConditionalOptions([]); setOverallFitness(""); setComments("");
                setSystematicExamination(""); setEyeExamResult(""); setEyeExamFitStatus("");
            }
             const loadOrCreateFormState = (existingFormData, setter, defaultState) => { if (existingFormData && Object.keys(existingFormData).length > 1) { setter({ ...defaultState, ...existingFormData, emp_no: currentEmpNo }); } else { setter(prevState => ({ ...defaultState, emp_no: currentEmpNo })); } };
             loadOrCreateFormState(data[0].form17, setForm17Data, initialForm17State); loadOrCreateFormState(data[0].form38, setForm38Data, initialForm38State); loadOrCreateFormState(data[0].form39, setForm39Data, initialForm39State); loadOrCreateFormState(data[0].form40, setForm40Data, initialForm40State); loadOrCreateFormState(data[0].form27, setForm27Data, initialForm27State);
             setSelectedStatutoryForms([]);
        } else {
            setFitnessFormData({ emp_no: '', tremors: "", romberg_test: "", acrophobia: "", trendelenberg_test: "" });
            setSelectedOptions([]); setConditionalOptions([]); setOverallFitness(""); setComments("");
            setSystematicExamination(""); setEyeExamResult(""); setEyeExamFitStatus("");
             setForm17Data({...initialForm17State, emp_no: ''}); setForm38Data({...initialForm38State, emp_no: ''}); setForm39Data({...initialForm39State, emp_no: ''}); setForm40Data({...initialForm40State, emp_no: ''}); setForm27Data({...initialForm27State, emp_no: ''});
             setSelectedStatutoryForms([]);
        }
    }, [data]);

    // Handlers (Keep as is, including new handlers)
    const handleForm17InputChange = (event) => { /* ... */ };
    const handleForm38InputChange = (event) => { /* ... */ };
    const handleForm39InputChange = (event) => { /* ... */ };
    const handleForm40InputChange = (event) => { /* ... */ };
    const handleForm27InputChange = (event) => { /* ... */ };
    const handleSelectChange = (e) => { /* ... */ };
    const handleRemoveSelected = (value) => { /* ... */ };
    const handleFitnessInputChange = (e) => { setFitnessFormData({ ...fitnessFormData, [e.target.name]: e.target.value }); };
    const handleOverallFitnessChange = (e) => { setOverallFitness(e.target.value); if (e.target.value !== 'conditional') { setConditionalOptions([]); }};
    const handleConditionalSelectChange = (e) => { /* ... */ };
    const handleRemoveConditionalSelected = (value) => { /* ... */ };
    const handleCommentsChange = (e) => { setComments(e.target.value); };
    const handleStatutorySelectChange = (e) => { /* ... */ };
    const handleRemoveStatutorySelected = (value) => { /* ... */ };
    const handleSystematicChange = (e) => { setSystematicExamination(e.target.value); };
    const handleEyeExamResultChange = (e) => { setEyeExamResult(e.target.value); };
    const handleEyeExamFitStatusChange = (e) => { setEyeExamFitStatus(e.target.value); };

    // getCookie function (Keep as is)
    function getCookie(name) { /* ... */ }

    // Submit Handlers (Keep as is, already include new fields in payload)
    const handleFitnessSubmit = async () => {
        // ... (handleFitnessSubmit logic remains the same)
        const currentEmpNo = data?.[0]?.emp_no;
        if (!currentEmpNo) { alert("Employee data not available. Cannot submit fitness assessment."); return; }
        const validityDateString = moment().add(3, 'months').format('YYYY-MM-DD');
        const payload = { emp_no: currentEmpNo, employer: data?.[0]?.employer || '', ...fitnessFormData, job_nature: JSON.stringify(selectedOptions), overall_fitness: overallFitness, conditional_fit_feilds: conditionalOptions, systematic_examination: systematicExamination, eye_exam_result: eyeExamResult, eye_exam_fit_status: eyeExamFitStatus, validity: validityDateString, comments: comments, };
        console.log("Submitting Fitness Assessment:", payload);
        const csrfToken = getCookie("csrftoken");
        if (!csrfToken) { alert("CSRF token not found. Cannot submit."); return; }
        try {
            const response = await fetch(FITNESS_ASSESSMENT_URL, { method: "POST", headers: { "Content-Type": "application/json", "X-CSRFToken": csrfToken }, body: JSON.stringify(payload), });
            const responseData = await response.json();
            if (!response.ok) { const errorDetail = responseData.detail || responseData.error || JSON.stringify(responseData); throw new Error(`Status ${response.status}: ${errorDetail}`); }
            alert("Fitness data submitted successfully!");
            setFitnessFormData(prevState => ({ ...prevState, tremors: "", romberg_test: "", acrophobia: "", trendelenberg_test: "" }));
            setSelectedOptions([]); setConditionalOptions([]); setOverallFitness(""); setComments("");
            setSystematicExamination(""); setEyeExamResult(""); setEyeExamFitStatus("");
        } catch (error) { console.error("Fitness Submit Error:", error); alert(`Error submitting fitness data: ${error.message}`); }
    };
    const submitStatutoryForm = async (url, formData, formName, setDataState, defaultState, removeFormCallback) => { /* ... */ };
    const submitForm17 = () => submitStatutoryForm(FORM17_URL, form17Data, "Form 17", setForm17Data, initialForm17State, handleRemoveStatutorySelected);
    const submitForm38 = () => submitStatutoryForm(FORM38_URL, form38Data, "Form 38", setForm38Data, initialForm38State, handleRemoveStatutorySelected);
    const submitForm39 = () => submitStatutoryForm(FORM39_URL, form39Data, "Form 39", setForm39Data, initialForm39State, handleRemoveStatutorySelected);
    const submitForm40 = () => submitStatutoryForm(FORM40_URL, form40Data, "Form 40", setForm40Data, initialForm40State, handleRemoveStatutorySelected);
    const submitForm27 = () => submitStatutoryForm(FORM27_URL, form27Data, "Form 27", setForm27Data, initialForm27State, handleRemoveStatutorySelected);

    // Render functions for Statutory Forms (Keep as is)
    const renderForm17 = () => { /* ... */ };
    const renderForm38 = () => { /* ... */ };
    const renderForm39 = () => { /* ... */ };
    const renderForm40 = () => { /* ... */ };
    const renderForm27 = () => { /* ... */ };

    const accessLevel = localStorage.getItem("accessLevel");

    // Main Return structure
    return (
          <div className="bg-gray-50 min-h-screen p-6 relative">
              <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-2">Fitness Assessment</h1>

              {/* Fitness Tests Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {["tremors", "romberg_test", "acrophobia", "trendelenberg_test"].map((test) => (
                      <div key={test} className="bg-white p-6 rounded-lg shadow border border-gray-200">
                          <h2 className="text-lg font-semibold mb-3 text-gray-700">{test.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}</h2>
                          <div className="space-y-2">
                              {["positive", "negative"].map((value) => (
                                  <label key={value} className="flex items-center space-x-3 cursor-pointer text-gray-600 hover:text-gray-900">
                                      <input type="radio" name={test} value={value} className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" checked={fitnessFormData[test] === value} onChange={handleFitnessInputChange} disabled={!data?.[0]?.emp_no}/>
                                      <span className="capitalize">{value}</span>
                                  </label>
                              ))}
                          </div>
                      </div>
                  ))}
              </div>

              {/* --- Eye Examination Section (MOVED - Visible to All) --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Eye Exam Result */}
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                        <label htmlFor="eyeExamResult" className="block text-lg font-semibold mb-3 text-gray-700">Eye Examination Result</label>
                        <select
                            id="eyeExamResult"
                            name="eyeExamResult"
                            value={eyeExamResult}
                            onChange={handleEyeExamResultChange}
                            // REMOVED: disabled={!data?.[0]?.emp_no}
                            className={`form-select block w-full p-3 border rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`} // Standard styling
                        >
                            {eyeExamResultOptions.map(option => (
                                <option key={option} value={option} disabled={option === ""}>
                                    {option || "-- Select Result --"}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Eye Exam Fit Status */}
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                         <label htmlFor="eyeExamFitStatus" className="block text-lg font-semibold mb-3 text-gray-700">Eye Exam Fitness Status</label>
                         <select
                            id="eyeExamFitStatus"
                            name="eyeExamFitStatus"
                            value={eyeExamFitStatus}
                            onChange={handleEyeExamFitStatusChange}
                            // REMOVED: disabled={!data?.[0]?.emp_no}
                            className={`form-select block w-full p-3 border rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`} // Standard styling
                        >
                             {eyeExamFitStatusOptions.map(option => (
                                <option key={option} value={option} disabled={option === ""}>
                                    {option || "-- Select Status --"}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
              {/* --- End Eye Examination Section --- */}


              {/* Job Nature, Overall Fitness, Conditional, Comments, Submit Section */}
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-8">
                  {/* Job Nature Select and Display */}
                  <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-2 text-gray-700">Job Nature (Select applicable)</h2>
                      <select
                          className={`form-select block w-full p-3 border rounded-md shadow-sm ${!data?.[0]?.emp_no ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50'}`}
                          onChange={handleSelectChange}
                          value=""
                          disabled={!data?.[0]?.emp_no} // Keep disabled if no employee
                          title={!data?.[0]?.emp_no ? "Select an employee first" : "Select job nature"}
                      >
                          <option value="" disabled>-- Select an option to add --</option>
                          {allOptions.map((option, index) => (
                              <option key={index} value={option} disabled={selectedOptions.includes(option)}>
                                  {option}
                              </option>
                          ))}
                      </select>
                      <div className="flex flex-wrap gap-2 mt-3">
                          {selectedOptions.length > 0 ? (
                              selectedOptions.map((option, index) => (
                                  <div key={index} className="flex items-center pl-3 pr-2 py-1 border border-blue-300 rounded-full bg-blue-50 text-sm text-blue-800 shadow-sm">
                                      <span>{option}</span>
                                      <button type="button" className="ml-2 text-red-500 hover:text-red-700 font-bold text-xs" onClick={() => handleRemoveSelected(option)} title={`Remove ${option}`}>×</button>
                                  </div>
                              ))
                          ) : ( <p className="text-sm text-gray-500 italic mt-2">No specific job nature selected.</p> )}
                      </div>
                  </div>

                 {/* -- Sections Previously Doctor-Only, Now Partially Visible to All -- */}

                  {/* Overall Fitness (Still Doctor-Only as per original logic) */}
                  {accessLevel === "doctor" && (
                    <div className="mt-6 mb-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-1">Overall Fitness Status</label>
                        <select
                            className={`form-select block w-full p-3 border rounded-md shadow-sm ${!data?.[0]?.emp_no ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50'}`}
                            onChange={handleOverallFitnessChange}
                            value={overallFitness}
                            disabled={!data?.[0]?.emp_no} // Keep disabled if no employee
                            title={!data?.[0]?.emp_no ? "Select an employee first" : "Set overall fitness"}
                        >
                            <option value="" disabled>-- Select status --</option>
                            <option value="fit">Fit</option>
                            <option value="unfit">Unfit</option>
                            <option value="conditional">Conditional Fit</option>
                        </select>
                    </div>
                  )}

                  {/* Conditional Fit Section (Still Doctor-Only, and depends on Overall Fitness state) */}
                  {accessLevel === "doctor" && overallFitness === "conditional" && (
                    <div className="mt-4 mb-6 pl-4 border-l-4 border-blue-300 py-3 bg-blue-50 rounded-r-md">
                        <h3 className="text-md font-semibold mb-2 text-gray-700">Conditionally Fit For (Select applicable)</h3>
                        <select
                            className="form-select block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            onChange={handleConditionalSelectChange}
                            value=""
                            disabled={!data?.[0]?.emp_no} // Keep disabled if no employee
                        >
                            <option value="" disabled>-- Select an option to add --</option>
                            {allOptions.map((option, index) => (
                                <option key={index} value={option} disabled={conditionalOptions.includes(option)}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {conditionalOptions.length > 0 ? (
                                conditionalOptions.map((option, index) => (
                                    <div key={index} className="flex items-center pl-3 pr-2 py-1 border border-green-300 rounded-full bg-green-50 text-sm text-green-800 shadow-sm">
                                        <span>{option}</span>
                                        <button type="button" className="ml-2 text-red-500 hover:text-red-700 font-bold text-xs" onClick={() => handleRemoveConditionalSelected(option)} title={`Remove ${option}`}>×</button>
                                    </div>
                                ))
                            ) : ( <p className="text-sm text-gray-500 italic mt-2">Specify conditions.</p> )}
                        </div>
                    </div>
                  )}

                    <div className="mt-6 mb-6">
                        <label htmlFor="systematicExamination" className="block text-gray-700 text-sm font-semibold mb-1">General Examination</label>
                        <textarea
                          id="systematicExamination"
                          name="systematicExamination"
                          className={`form-textarea block w-full p-3 border rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`} // Standard styling
                          rows="3"
                          value={systematicExamination}
                          onChange={handleSystematicChange}
                          // REMOVED: disabled={!data?.[0]?.emp_no}
                          title={"Add General Examination details (CVS, RS, GIT, CNS, etc)"} // Tooltip always visible
                          placeholder="Enter General Examination details here"
                        />
                    </div>

                  {/* Systematic Examination (MOVED - Visible to All) */}
                  <div className="mt-6 mb-6">
                        <label htmlFor="systematicExamination" className="block text-gray-700 text-sm font-semibold mb-1">Systematic Examination</label>
                        <textarea
                          id="systematicExamination"
                          name="systematicExamination"
                          className={`form-textarea block w-full p-3 border rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`} // Standard styling
                          rows="3"
                          value={systematicExamination}
                          onChange={handleSystematicChange}
                          // REMOVED: disabled={!data?.[0]?.emp_no}
                          title={"Add Systematic Examination details (CVS, RS, GIT, CNS, etc)"} // Tooltip always visible
                          placeholder="Enter Systematic Examination details (CVS, RS, GIT, CNS, etc)"
                        />
                    </div>

                  {/* Comments (Still Doctor-Only as per original logic) */}
                   {accessLevel === "doctor" && (
                    <div className="mt-6 mb-6">
                        <label htmlFor="comments" className="block text-gray-700 text-sm font-semibold mb-1">Doctor's Remarks / Comments</label>
                        <textarea
                            id="comments"
                            className={`form-textarea block w-full p-3 border rounded-md shadow-sm ${!data?.[0]?.emp_no ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50'}`}
                            rows="3"
                            value={comments}
                            onChange={handleCommentsChange}
                            disabled={!data?.[0]?.emp_no} // Keep disabled if no employee
                            title={!data?.[0]?.emp_no ? "Select an employee first" : "Add comments"}
                            placeholder="Enter any relevant comments..."
                        />
                    </div>
                   )}

                   {/* Submit Button for Fitness Assessment */}
                    <div className="w-full flex justify-end mt-6 border-t pt-6">
                        <button className={`bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 font-medium ${!data?.[0]?.emp_no ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={handleFitnessSubmit}
                                disabled={!data?.[0]?.emp_no} // Submit still requires emp_no
                                title={!data?.[0]?.emp_no ? "Cannot submit without employee data" : "Submit fitness assessment"}
                                >
                            Submit Fitness Assessment
                        </button>
                    </div>
              </div>

              {/* Statutory Forms Section (Still Doctor Only) */}
               {accessLevel === "doctor" && (
                <>
                    <>
                        <h1 className="text-3xl font-bold my-8 text-gray-800 border-b pb-2">Statutory Forms</h1>
                        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-8">
                            <h2 className="text-lg font-semibold mb-4 text-gray-700">Select Forms to Fill / Generate PDF</h2>
                            <select
                                className={`form-select block w-full p-3 border rounded-md shadow-sm mb-4 ${!data?.[0]?.emp_no ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50'}`}
                                onChange={handleStatutorySelectChange}
                                value="Select Form"
                                disabled={!data?.[0]?.emp_no} // Keep disabled
                                title={!data?.[0]?.emp_no ? "Select an employee first" : "Select a form"}
                            >
                                {statutoryOptions.map((option, index) => (
                                    <option key={index} value={option} disabled={option === "Select Form" || selectedStatutoryForms.includes(option)}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <div className="flex flex-wrap gap-2 mt-4 mb-6 border-t pt-4">
                                {selectedStatutoryForms.length > 0 ? (
                                    selectedStatutoryForms.map((option, index) => (
                                        <div key={index} className="flex items-center pl-3 pr-2 py-1 border border-gray-300 rounded-full bg-gray-100 text-sm text-gray-800 shadow-sm">
                                            <span>{option}</span>
                                            <button type="button" className="ml-2 text-red-500 hover:text-red-700 font-bold text-xs" onClick={() => handleRemoveStatutorySelected(option)} title={`Remove ${option}`}>×</button>
                                        </div>
                                    ))
                                ) : ( <p className="text-sm text-gray-500 italic w-full">No statutory forms selected to display/fill.</p> )}
                            </div>
                            {selectedStatutoryForms.length > 0 && (
                                <div className="flex flex-col space-y-6 mt-4">
                                    {selectedStatutoryForms.includes("Form 17") && renderForm17()}
                                    {selectedStatutoryForms.includes("Form 38") && renderForm38()}
                                    {selectedStatutoryForms.includes("Form 39") && renderForm39()}
                                    {selectedStatutoryForms.includes("Form 40") && renderForm40()}
                                    {selectedStatutoryForms.includes("Form 27") && renderForm27()}
                                </div>
                            )}
                        </div>
                    </>
                    {/* Significant Notes Component */}
                    {data && data[0] && <SignificantNotes data={data} />}
                    </>
                )}

              
          </div>
      );
};

export default FitnessPage;