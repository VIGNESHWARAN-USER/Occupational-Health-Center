import React, { useState, useEffect } from "react";
import moment from 'moment';
import jsPDF from 'jspdf'; // Ensure jspdf is installed: npm install jspdf
import SignificantNotes from "./SignificantNotes"; // Assuming this component exists

// URLs (Keep as is)
const FITNESS_ASSESSMENT_URL = "https://occupational-health-center-1.onrender.com/fitness-tests/";
const FORM17_URL = "https://occupational-health-center-1.onrender.com/form17/";
const FORM38_URL = "https://occupational-health-center-1.onrender.com/form38/";
const FORM39_URL = "https://occupational-health-center-1.onrender.com/form39/";
const FORM40_URL = "https://occupational-health-center-1.onrender.com/form40/";
const FORM27_URL = "https://occupational-health-center-1.onrender.com/form27/";

// --- Label Mappings ---
// Define comprehensive labels for PDF generation (Example for Form 17)
const FORM17_LABELS = {
    emp_no: 'Employee No',
    date_of_examination: 'Date of Examination',
    // Add ALL other Form 17 fields here with user-friendly labels
    // ...
};
const FORM38_LABELS = { emp_no: 'Employee No', /* ... other fields */ };
const FORM39_LABELS = { emp_no: 'Employee No', /* ... other fields */ };
const FORM40_LABELS = { emp_no: 'Employee No', /* ... other fields */ };
const FORM27_LABELS = { emp_no: 'Employee No', /* ... other fields */ };
// --- End Label Mappings ---


// --- PDF Generation Function ---
const generateFormPdf = (formData, formTitle, empNo, empName, fieldLabels) => {
    const doc = new jsPDF();
    const margin = 15;
    let yPos = margin;

    // Title
    doc.setFontSize(18);
    doc.text(formTitle, doc.internal.pageSize.getWidth() / 2, yPos, { align: 'center' });
    yPos += 10;

    // Employee Info
    doc.setFontSize(12);
    doc.text(`Employee No: ${empNo || 'N/A'}`, margin, yPos);
    doc.text(`Employee Name: ${empName || 'N/A'}`, margin + 80, yPos); // Adjust position as needed
    yPos += 10;
    doc.setLineWidth(0.5);
    doc.line(margin, yPos - 2, doc.internal.pageSize.getWidth() - margin, yPos - 2); // Separator line
    yPos += 8;


    // Form Data
    doc.setFontSize(10);
    const columnWidth = (doc.internal.pageSize.getWidth() - 2 * margin - 5) / 2; // Two columns with gap

    let currentX = margin;
    let column = 1;

    for (const key in fieldLabels) {
        if (Object.hasOwnProperty.call(fieldLabels, key)) {
            // Skip emp_no as it's already printed
            if (key === 'emp_no') continue;

            const label = fieldLabels[key];
            let value = formData[key];

            // Basic formatting for common types
            if (value === null || value === undefined) {
                value = 'N/A';
            } else if (typeof value === 'boolean') {
                value = value ? 'Yes' : 'No';
            } else if (typeof value === 'string' && (value.includes('T') && value.includes('Z') && !isNaN(Date.parse(value)))) {
                // Attempt to format date strings
                const formattedDate = moment(value).format('DD-MMM-YYYY');
                if (formattedDate !== 'Invalid date') {
                    value = formattedDate;
                }
            }

            const textLines = doc.splitTextToSize(`${label}: ${value}`, columnWidth);

            // Check if content fits in the current column, move to next page/column if needed
            if (yPos + (textLines.length * 5) > doc.internal.pageSize.getHeight() - margin) {
                if (column === 1) {
                    currentX = margin + columnWidth + 5; // Move to second column
                    yPos = margin + 28; // Reset yPos below header
                    column = 2;
                } else {
                    doc.addPage(); // Add new page
                    yPos = margin; // Reset yPos
                     // Re-add Title and basic info on new page
                    doc.setFontSize(18); doc.text(formTitle, doc.internal.pageSize.getWidth() / 2, yPos, { align: 'center' }); yPos += 10;
                    doc.setFontSize(12); doc.text(`Employee No: ${empNo || 'N/A'}`, margin, yPos); doc.text(`Employee Name: ${empName || 'N/A'}`, margin + 80, yPos); yPos += 10;
                    doc.setLineWidth(0.5); doc.line(margin, yPos - 2, doc.internal.pageSize.getWidth() - margin, yPos - 2); yPos += 8;
                    doc.setFontSize(10);
                    currentX = margin; // Back to first column
                    column = 1;
                }
            }

            doc.text(textLines, currentX, yPos);
            yPos += (textLines.length * 5) + 3; // Adjust spacing between fields

            // Handle column switching within a page if space runs out vertically before horizontally
            if (column === 1 && yPos > doc.internal.pageSize.getHeight() - margin) {
                 currentX = margin + columnWidth + 5; // Move to second column
                 yPos = margin + 28; // Reset yPos below header
                 column = 2;
            }
        }
    }

    // Save the PDF
    doc.save(`${formTitle.replace(/\s+/g, '_')}_${empNo}.pdf`);
};
// --- End PDF Generation Function ---


const FitnessPage = ({ data }) => {
    // Options (Keep as is)
    
    const allOptions = ["Height", "Gas Line", "Confined Space", "SCBA Rescue", "Fire Rescue", "Lone", "Fisher Man", "Snake Catcher"];
    const statutoryOptions = ["Select Form", "Form 17", "Form 38", "Form 39", "Form 40", "Form 27"];
    const eyeExamResultOptions = ["", "Normal", "Defective", "Color Blindness"];
    const eyeExamFitStatusOptions = [
        "", "Fit", "Fit when newly prescribed glass", "Fit with existing glass",
        "Fit with an advice to change existing glass with newly prescribed glass", "Unfit"
    ];

    // State
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [conditionalOptions, setConditionalOptions] = useState([]);
    const [overallFitness, setOverallFitness] = useState(""); // Doctor Only
    const [fitnessFormData, setFitnessFormData] = useState({
        emp_no: data?.[0]?.emp_no || '',
        tremors: "", romberg_test: "", acrophobia: "", trendelenberg_test: "",
    });
    const [systematicExamination, setSystematicExamination] = useState(""); // All Access
    const [generalExamination, setGeneralExamination] = useState(""); // <<-- ADDED STATE
    const [eyeExamResult, setEyeExamResult] = useState(""); // All Access
    const [eyeExamFitStatus, setEyeExamFitStatus] = useState(""); // All Access
    const [comments, setComments] = useState(""); // Doctor Only

    // Statutory Form States (Doctor Only)
    // Ensure emp_no is part of the initial state for reset logic
    const initialForm17State = { emp_no: '', date_of_examination: '', /* ... other fields default values */ };
    const initialForm38State = { emp_no: '', /* ... */ };
    const initialForm39State = { emp_no: '', /* ... */ };
    const initialForm40State = { emp_no: '', /* ... */ };
    const initialForm27State = { emp_no: '', /* ... */ };

    const [form17Data, setForm17Data] = useState(initialForm17State);
    const [form38Data, setForm38Data] = useState(initialForm38State);
    const [form39Data, setForm39Data] = useState(initialForm39State);
    const [form40Data, setForm40Data] = useState(initialForm40State);
    const [form27Data, setForm27Data] = useState(initialForm27State);
    const [selectedStatutoryForms, setSelectedStatutoryForms] = useState([]); // Doctor Only

    // Get Access Level (assuming it's stored correctly in localStorage)
    const accessLevel = localStorage.getItem("accessLevel"); // 'doctor' or 'nurse' (or other)

    // useEffect for loading data
    useEffect(() => {
        const currentEmpNo = data?.[0]?.emp_no || '';
        const currentEmployer = data?.[0]?.employer || ''; // Get employer name

        // Helper to safely parse JSON array strings
        const parseJsonArray = (jsonString) => {
            if (!jsonString) return [];
            try {
                const parsed = JSON.parse(jsonString);
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                console.warn("Could not parse JSON array string:", jsonString, e);
                return [];
            }
        };

        // Helper to load or initialize statutory form state
        const loadOrCreateFormState = (existingFormData, setter, defaultState) => {
            const initialStateWithEmpNo = { ...defaultState, emp_no: currentEmpNo };
            if (existingFormData && Object.keys(existingFormData).length > 1) { // Check if more than just emp_no exists
                setter({ ...initialStateWithEmpNo, ...existingFormData });
            } else {
                setter(initialStateWithEmpNo);
            }
        };

        if (data && data[0]) {
            // Load Fitness Assessment Data
            const assessmentData = data[0].fitnessassessment;
            if (assessmentData) {
                setFitnessFormData({
                    emp_no: assessmentData.emp_no || currentEmpNo,
                    tremors: assessmentData.tremors || "",
                    romberg_test: assessmentData.romberg_test || "",
                    acrophobia: assessmentData.acrophobia || "",
                    trendelenberg_test: assessmentData.trendelenberg_test || "",
                });
                setSelectedOptions(parseJsonArray(assessmentData.job_nature));
                setConditionalOptions(parseJsonArray(assessmentData.conditional_fit_feilds));
                setOverallFitness(assessmentData.overall_fitness || "");
                setComments(assessmentData.comments || "");
                setSystematicExamination(assessmentData.systematic_examination || "");
                setEyeExamResult(assessmentData.eye_exam_result || "");
                setEyeExamFitStatus(assessmentData.eye_exam_fit_status || "");
            } else {
                // Reset Fitness Assessment fields if no assessment data exists
                 setFitnessFormData(prevState => ({ ...prevState, emp_no: currentEmpNo, tremors: "", romberg_test: "", acrophobia: "", trendelenberg_test: "" }));
                 setSelectedOptions([]); setConditionalOptions([]); setOverallFitness(""); setComments("");
                 setSystematicExamination(""); setEyeExamResult(""); setEyeExamFitStatus("");
            }

            // Load or Initialize Statutory Forms Data
            loadOrCreateFormState(data[0].form17, setForm17Data, initialForm17State);
            loadOrCreateFormState(data[0].form38, setForm38Data, initialForm38State);
            loadOrCreateFormState(data[0].form39, setForm39Data, initialForm39State);
            loadOrCreateFormState(data[0].form40, setForm40Data, initialForm40State);
            loadOrCreateFormState(data[0].form27, setForm27Data, initialForm27State);
            setSelectedStatutoryForms([]); // Reset selected forms display on data change

        } else {
            // Reset all state if no employee data (`data` is null/empty)
            setFitnessFormData({ emp_no: '', tremors: "", romberg_test: "", acrophobia: "", trendelenberg_test: "" });
            setSelectedOptions([]); setConditionalOptions([]); setOverallFitness(""); setComments("");
            setSystematicExamination(""); setEyeExamResult(""); setEyeExamFitStatus("");
            setForm17Data({...initialForm17State, emp_no: ''}); // Reset with empty emp_no
            setForm38Data({...initialForm38State, emp_no: ''});
            setForm39Data({...initialForm39State, emp_no: ''});
            setForm40Data({...initialForm40State, emp_no: ''});
            setForm27Data({...initialForm27State, emp_no: ''});
            setSelectedStatutoryForms([]);
        }
    }, [data]); // Re-run only when the main `data` prop changes


    // --- Handlers ---

    // Fitness Test Radios
    const handleFitnessInputChange = (e) => { setFitnessFormData({ ...fitnessFormData, [e.target.name]: e.target.value }); };

    // Job Nature Selection
    const handleSelectChange = (e) => {
        const value = e.target.value;
        if (value && !selectedOptions.includes(value)) {
            setSelectedOptions([...selectedOptions, value]);
        }
        e.target.value = ""; // Reset select
    };
    const handleRemoveSelected = (value) => { setSelectedOptions(selectedOptions.filter(option => option !== value)); };

    // Eye Examination Dropdowns
    const handleEyeExamResultChange = (e) => { setEyeExamResult(e.target.value); };
    const handleEyeExamFitStatusChange = (e) => { setEyeExamFitStatus(e.target.value); };

    // Systematic Examination Textarea
    const handleSystematicChange = (e) => { setSystematicExamination(e.target.value); };

    // General Examination Textarea (NEW HANDLER)
    const handleGeneralExaminationChange = (e) => { setGeneralExamination(e.target.value); };

    

    // --- Doctor Only Handlers ---
    const handleOverallFitnessChange = (e) => {
        if (accessLevel !== 'doctor') return; // Prevent non-doctors
        setOverallFitness(e.target.value);
        // If status changes away from 'conditional', clear conditional options
        if (e.target.value !== 'conditional') {
            setConditionalOptions([]);
        }
    };

    const handleConditionalSelectChange = (e) => {
        if (accessLevel !== 'doctor') return; // Prevent non-doctors
        const value = e.target.value;
        if (value && !conditionalOptions.includes(value)) {
            setConditionalOptions([...conditionalOptions, value]);
        }
        e.target.value = ""; // Reset select
    };
    const handleRemoveConditionalSelected = (value) => {
         if (accessLevel !== 'doctor') return; // Prevent non-doctors
         setConditionalOptions(conditionalOptions.filter(option => option !== value));
    };

    const handleCommentsChange = (e) => {
        if (accessLevel !== 'doctor') return; // Prevent non-doctors
        setComments(e.target.value);
     };

    const handleStatutorySelectChange = (e) => {
         if (accessLevel !== 'doctor') return; // Prevent non-doctors
         const value = e.target.value;
         if (value && value !== "Select Form" && !selectedStatutoryForms.includes(value)) {
             setSelectedStatutoryForms([...selectedStatutoryForms, value]);
         }
         e.target.value = "Select Form"; // Reset select
    };
    const handleRemoveStatutorySelected = (value) => {
        if (accessLevel !== 'doctor') return; // Prevent non-doctors
        setSelectedStatutoryForms(selectedStatutoryForms.filter(form => form !== value));
    };

    // Statutory Form Input Handlers (Doctor Only implied by context)
    const handleForm17InputChange = (event) => { setForm17Data({ ...form17Data, [event.target.name]: event.target.value }); };
    const handleForm38InputChange = (event) => { setForm38Data({ ...form38Data, [event.target.name]: event.target.value }); };
    const handleForm39InputChange = (event) => { setForm39Data({ ...form39Data, [event.target.name]: event.target.value }); };
    const handleForm40InputChange = (event) => { setForm40Data({ ...form40Data, [event.target.name]: event.target.value }); };
    const handleForm27InputChange = (event) => { setForm27Data({ ...form27Data, [event.target.name]: event.target.value }); };
    // --- End Handlers ---


    // getCookie function (Needed for CSRF token)
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // --- Submit Handlers ---
    const handleFitnessSubmit = async () => {
        const currentEmpNo = data?.[0]?.emp_no;
        if (!currentEmpNo) {
            alert("Employee data not available. Cannot submit fitness assessment.");
            return;
        }

        // Calculate validity date (e.g., 3 months from now)
        const validityDateString = moment().add(3, 'months').format('YYYY-MM-DD');

        // Construct payload - includes fields editable by all roles + doctor-only fields
        const payload = {
            emp_no: currentEmpNo,
            employer: data?.[0]?.employer || '', // Include employer name if available
            ...fitnessFormData, // tremors, romberg_test, acrophobia, trendelenberg_test
            job_nature: JSON.stringify(selectedOptions), // All access
            systematic_examination: systematicExamination, // All access
            general_examination: generalExamination, // All access <<-- ADDED BACK -->>
            eye_exam_result: eyeExamResult, // All access
            eye_exam_fit_status: eyeExamFitStatus, // All access
            // Doctor only fields included below (backend should ideally ignore if not a doctor?)
            overall_fitness: overallFitness,
            conditional_fit_feilds: overallFitness === 'conditional' ? JSON.stringify(conditionalOptions) : JSON.stringify([]), // Only send if conditional
            comments: comments,
            // System generated
            validity: validityDateString,
        };

        console.log("Submitting Fitness Assessment:", payload);

        

        try {
            const response = await fetch(FITNESS_ASSESSMENT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const responseData = await response.json(); // Always try to parse JSON

            if (!response.ok) {
                // Try to get detailed error message from backend response
                const errorDetail = responseData?.detail || responseData?.error || JSON.stringify(responseData);
                throw new Error(`Status ${response.status}: ${errorDetail}`);
            }

            alert("Fitness data submitted successfully!");
            // Optionally: Re-fetch data or clear relevant parts of the form
            // For now, just clear some fields as an example (adjust as needed)
            // setFitnessFormData(prevState => ({ ...prevState, tremors: "", romberg_test: "", acrophobia: "", trendelenberg_test: "" }));
            // setSelectedOptions([]);
            // setConditionalOptions([]); // Cleared if overallFitness changes anyway
            // setOverallFitness(""); // Don't clear doctor fields automatically
            // setComments("");
            // setSystematicExamination("");
            // setEyeExamResult("");
            // setEyeExamFitStatus("");

        } catch (error) {
            console.error("Fitness Submit Error:", error);
            alert(`Error submitting fitness data: ${error.message}`);
        }
    };

    // Statutory Form Submit (Doctor Only by implication)
    const submitStatutoryForm = async (url, formData, formName, setDataState, defaultState, removeFormCallback) => {
        if (accessLevel !== 'doctor') {
            alert("Only doctors can submit statutory forms.");
            return;
        }
        const currentEmpNo = formData.emp_no;
         if (!currentEmpNo) {
             alert(`Employee number missing for ${formName}. Cannot submit.`);
             return;
         }
         // Add current date/time if the form expects it and it's missing
         const payload = {
            ...formData,
            ...(formData.date_of_examination === '' && { date_of_examination: moment().format('YYYY-MM-DD') }),
            // Add other auto-filled fields if necessary
         };

        console.log(`Submitting ${formName}:`, payload);
        const csrfToken = getCookie("csrftoken");
        if (!csrfToken) { alert("CSRF token not found."); return; }

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json", "X-CSRFToken": csrfToken },
                body: JSON.stringify(payload),
            });
             const responseData = await response.json();
            if (!response.ok) {
                 const errorDetail = responseData?.detail || responseData?.error || JSON.stringify(responseData);
                 throw new Error(`Status ${response.status}: ${errorDetail}`);
            }
            alert(`${formName} submitted successfully!`);
            // Reset form state after successful submission
            setDataState({ ...defaultState, emp_no: currentEmpNo });
            // Remove from the display list
            removeFormCallback(formName);
        } catch (error) {
            console.error(`Error submitting ${formName}:`, error);
            alert(`Error submitting ${formName}: ${error.message}`);
        }
    };

    // Specific Submit Functions (Doctor Only)
    const submitForm17 = () => submitStatutoryForm(FORM17_URL, form17Data, "Form 17", setForm17Data, initialForm17State, handleRemoveStatutorySelected);
    const submitForm38 = () => submitStatutoryForm(FORM38_URL, form38Data, "Form 38", setForm38Data, initialForm38State, handleRemoveStatutorySelected);
    const submitForm39 = () => submitStatutoryForm(FORM39_URL, form39Data, "Form 39", setForm39Data, initialForm39State, handleRemoveStatutorySelected);
    const submitForm40 = () => submitStatutoryForm(FORM40_URL, form40Data, "Form 40", setForm40Data, initialForm40State, handleRemoveStatutorySelected);
    const submitForm27 = () => submitStatutoryForm(FORM27_URL, form27Data, "Form 27", setForm27Data, initialForm27State, handleRemoveStatutorySelected);

    // --- End Submit Handlers ---


    // --- Render functions for Statutory Forms (Doctor Only) ---
    // These should contain the actual input fields for each form
    // Example for Form 17 - Add all necessary fields
    const renderForm17 = () => (
        <div className="border p-4 rounded-md bg-gray-50 shadow-inner">
            <h3 className="text-md font-semibold mb-3 text-gray-600">Form 17 Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="form17_date_exam" className="block text-sm font-medium text-gray-700">Date of Examination</label>
                    <input
                        type="date"
                        id="form17_date_exam"
                        name="date_of_examination" // Matches state key
                        value={form17Data.date_of_examination || moment().format('YYYY-MM-DD')} // Default to today
                        onChange={handleForm17InputChange}
                        className="form-input block w-full mt-1 border-gray-300 rounded-md shadow-sm" />
                </div>
                 {/* Add more Form 17 fields here */}
                 {/* Example:
                 <div>
                     <label htmlFor="form17_field_x" className="block text-sm font-medium text-gray-700">Field X</label>
                     <input type="text" id="form17_field_x" name="field_x" value={form17Data.field_x || ''} onChange={handleForm17InputChange} className="form-input block w-full mt-1 border-gray-300 rounded-md shadow-sm" />
                 </div>
                 */}

            </div>
            <div className="mt-4 flex justify-between items-center">
                 <button onClick={submitForm17} className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700">Submit Form 17</button>
                 <button onClick={() => generateFormPdf(form17Data, "Form 17", data?.[0]?.emp_no, data?.[0]?.emp_name, FORM17_LABELS)} className="bg-yellow-500 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-600">Generate PDF</button>
            </div>
        </div>
    );
    // Define renderForm38, renderForm39, renderForm40, renderForm27 similarly...
     const renderForm38 = () => ( <div className="border p-4 rounded-md bg-gray-50 shadow-inner"> <h3 className="text-md font-semibold mb-3 text-gray-600">Form 38 Details</h3> {/* ... Fields ... */} <div className="mt-4 flex justify-between items-center"> <button onClick={submitForm38} className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700">Submit Form 38</button> <button onClick={() => generateFormPdf(form38Data, "Form 38", data?.[0]?.emp_no, data?.[0]?.emp_name, FORM38_LABELS)} className="bg-yellow-500 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-600">Generate PDF</button> </div> </div> );
     const renderForm39 = () => ( <div className="border p-4 rounded-md bg-gray-50 shadow-inner"> <h3 className="text-md font-semibold mb-3 text-gray-600">Form 39 Details</h3> {/* ... Fields ... */} <div className="mt-4 flex justify-between items-center"> <button onClick={submitForm39} className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700">Submit Form 39</button> <button onClick={() => generateFormPdf(form39Data, "Form 39", data?.[0]?.emp_no, data?.[0]?.emp_name, FORM39_LABELS)} className="bg-yellow-500 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-600">Generate PDF</button> </div> </div> );
     const renderForm40 = () => ( <div className="border p-4 rounded-md bg-gray-50 shadow-inner"> <h3 className="text-md font-semibold mb-3 text-gray-600">Form 40 Details</h3> {/* ... Fields ... */} <div className="mt-4 flex justify-between items-center"> <button onClick={submitForm40} className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700">Submit Form 40</button> <button onClick={() => generateFormPdf(form40Data, "Form 40", data?.[0]?.emp_no, data?.[0]?.emp_name, FORM40_LABELS)} className="bg-yellow-500 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-600">Generate PDF</button> </div> </div> );
     const renderForm27 = () => ( <div className="border p-4 rounded-md bg-gray-50 shadow-inner"> <h3 className="text-md font-semibold mb-3 text-gray-600">Form 27 Details</h3> {/* ... Fields ... */} <div className="mt-4 flex justify-between items-center"> <button onClick={submitForm27} className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700">Submit Form 27</button> <button onClick={() => generateFormPdf(form27Data, "Form 27", data?.[0]?.emp_no, data?.[0]?.emp_name, FORM27_LABELS)} className="bg-yellow-500 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-600">Generate PDF</button> </div> </div> );
    // --- End Render Functions ---


    // Main Return structure
    return (
          <div className="bg-gray-50 min-h-screen p-6 relative">
              <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-2">Fitness Assessment</h1>

              {/* Fitness Tests Section (All Access) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {["tremors", "romberg_test", "acrophobia", "trendelenberg_test"].map((test) => (
                      <div key={test} className="bg-white p-6 rounded-lg shadow border border-gray-200">
                          <h2 className="text-lg font-semibold mb-3 text-gray-700">{test.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</h2>
                          <div className="space-y-2">
                              {["positive", "negative"].map((value) => (
                                  <label key={value} className="flex items-center space-x-3 cursor-pointer text-gray-600 hover:text-gray-900">
                                      <input
                                        type="radio"
                                        name={test}
                                        value={value}
                                        className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                        checked={fitnessFormData[test] === value}
                                        onChange={handleFitnessInputChange}
                                        disabled={!data?.[0]?.emp_no} // Disabled if no employee selected
                                       />
                                      <span className="capitalize">{value}</span>
                                  </label>
                              ))}
                          </div>
                      </div>
                  ))}
              </div>

              {/* Eye Examination Section (All Access) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Eye Exam Result */}
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                        <label htmlFor="eyeExamResult" className="block text-lg font-semibold mb-3 text-gray-700">Eye Examination Result</label>
                        <select
                            id="eyeExamResult"
                            name="eyeExamResult"
                            value={eyeExamResult}
                            onChange={handleEyeExamResultChange}
                            disabled={!data?.[0]?.emp_no} // Disabled if no employee selected
                            className={`form-select block w-full p-3 border rounded-md shadow-sm ${!data?.[0]?.emp_no ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50'}`}
                            title={!data?.[0]?.emp_no ? "Select an employee first" : ""}
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
                            disabled={!data?.[0]?.emp_no} // Disabled if no employee selected
                            className={`form-select block w-full p-3 border rounded-md shadow-sm ${!data?.[0]?.emp_no ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50'}`}
                            title={!data?.[0]?.emp_no ? "Select an employee first" : ""}
                        >
                             {eyeExamFitStatusOptions.map(option => (
                                <option key={option} value={option} disabled={option === ""}>
                                    {option || "-- Select Status --"}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

              {/* Combined Section for Job Nature, Exams, Remarks, and Doctor-Only Fitness */}
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-8">

                  {/* Job Nature Select and Display (All Access) */}
                  <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-2 text-gray-700">Job Nature (Select applicable)</h2>
                      <select
                          className={`form-select block w-full p-3 border rounded-md shadow-sm ${!data?.[0]?.emp_no ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50'}`}
                          onChange={handleSelectChange}
                          value=""
                          disabled={!data?.[0]?.emp_no}
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

                   {/* Systematic Examination (All Access) */}
                   <div className="mt-6 mb-6">
                        <label htmlFor="systematicExamination" className="block text-gray-700 text-sm font-semibold mb-1">Systematic Examination</label>
                        <textarea
                          id="systematicExamination"
                          name="systematicExamination"
                          className={`form-textarea block w-full p-3 border rounded-md shadow-sm ${!data?.[0]?.emp_no ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50'}`}
                          rows="3"
                          value={systematicExamination}
                          onChange={handleSystematicChange}
                          disabled={!data?.[0]?.emp_no} // Disabled if no employee selected
                          title={!data?.[0]?.emp_no ? "Select an employee first" : "Add Systematic Examination details (CVS, RS, GIT, CNS, etc)"}
                          placeholder="Enter Systematic Examination details (CVS, RS, GIT, CNS, etc)"
                        />
                    </div>

                    {/* General Examination (All Access) <<-- ADDED BACK -->> */}
                    <div className="mt-6 mb-6">
                        <label htmlFor="generalExamination" className="block text-gray-700 text-sm font-semibold mb-1">General Examination</label>
                        <textarea
                          id="generalExamination"
                          name="generalExamination" // Matches state variable if needed for backend
                          className={`form-textarea block w-full p-3 border rounded-md shadow-sm ${!data?.[0]?.emp_no ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50'}`}
                          rows="3"
                          value={generalExamination}
                          onChange={handleGeneralExaminationChange} // Use the new handler
                          disabled={!data?.[0]?.emp_no}
                          title={!data?.[0]?.emp_no ? "Select an employee first" : "Add General Examination details"}
                          placeholder="Enter General Examination details here"
                        />
                    </div>

                  {/* --- Doctor Only Fields --- */}
                  {accessLevel === "doctor" && (
                    <>
                        {/* Overall Fitness */}
                        <div className="mt-6 mb-6">
                            <label className="block text-gray-700 text-sm font-semibold mb-1">Overall Fitness Status</label>
                            <select
                                className={`form-select block w-full p-3 border rounded-md shadow-sm ${!data?.[0]?.emp_no ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50'}`}
                                onChange={handleOverallFitnessChange}
                                value={overallFitness}
                                disabled={!data?.[0]?.emp_no}
                                title={!data?.[0]?.emp_no ? "Select an employee first" : "Set overall fitness"}
                            >
                                <option value="" disabled>-- Select status --</option>
                                <option value="fit">Fit</option>
                                <option value="unfit">Unfit</option>
                                <option value="conditional">Conditional Fit</option>
                            </select>
                        </div>

                        {/* Conditional Fit Section (Only appears if Overall is 'conditional') */}
                        {overallFitness === "conditional" && (
                            <div className="mt-4 mb-6 pl-4 border-l-4 border-blue-300 py-3 bg-blue-50 rounded-r-md">
                                <h3 className="text-md font-semibold mb-2 text-gray-700">Conditionally Fit For (Select applicable)</h3>
                                <select
                                    className="form-select block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    onChange={handleConditionalSelectChange}
                                    value=""
                                    disabled={!data?.[0]?.emp_no}
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

                        {/* Comments */}
                        <div className="mt-6 mb-6">
                            <label htmlFor="comments" className="block text-gray-700 text-sm font-semibold mb-1">Doctor's Remarks / Comments</label>
                            <textarea
                                id="comments"
                                className={`form-textarea block w-full p-3 border rounded-md shadow-sm ${!data?.[0]?.emp_no ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50'}`}
                                rows="3"
                                value={comments}
                                onChange={handleCommentsChange}
                                disabled={!data?.[0]?.emp_no}
                                title={!data?.[0]?.emp_no ? "Select an employee first" : "Add comments"}
                                placeholder="Enter any relevant comments..."
                            />
                        </div>
                    </>
                 )}
                 {/* --- End Doctor Only Fields --- */}


                 {/* Submit Button for Fitness Assessment (All Access - enabled if emp_no exists) */}
                  <div className="w-full flex justify-end mt-6 border-t pt-6">
                      <button
                        className={`bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 font-medium ${!data?.[0]?.emp_no ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleFitnessSubmit}
                        disabled={!data?.[0]?.emp_no} // Submit requires emp_no
                        title={!data?.[0]?.emp_no ? "Cannot submit without employee data" : "Submit fitness assessment"}
                      >
                          Submit Fitness Assessment
                      </button>
                  </div>
              </div>


              {/* Statutory Forms Section (Doctor Only) */}
               {accessLevel === "doctor" && (
                <>
                    <h1 className="text-3xl font-bold my-8 text-gray-800 border-b pb-2">Statutory Forms</h1>
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-8">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">Select Forms to Fill / Generate PDF</h2>
                        <select
                            className={`form-select block w-full p-3 border rounded-md shadow-sm mb-4 ${!data?.[0]?.emp_no ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50'}`}
                            onChange={handleStatutorySelectChange}
                            value="Select Form" // Always show placeholder
                            disabled={!data?.[0]?.emp_no}
                            title={!data?.[0]?.emp_no ? "Select an employee first" : "Select a form"}
                        >
                            {statutoryOptions.map((option, index) => (
                                <option key={index} value={option} disabled={option === "Select Form" || selectedStatutoryForms.includes(option)}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        {/* Display selected forms and render their inputs */}
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

                        {/* Render the actual form components */}
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

                    {/* Significant Notes Component (Doctor Only) */}
                    {data && data[0] && <SignificantNotes data={data} />}
                </>
                )}
          </div>
      );
};

export default FitnessPage;