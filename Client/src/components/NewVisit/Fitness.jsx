    import React, { useState, useEffect, useCallback } from "react"; // Added useCallback
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

    // --- Standard Input/Select Class ---
    const inputClass = "form-input block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm";
    const selectClass = "form-select block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm";
    const labelClass = "block text-sm font-medium text-gray-700";

    // --- Label Mappings (EXPANDED - Keep as is) ---
    const FORM17_LABELS = { /* ... no changes ... */ };
    const FORM38_LABELS = { /* ... no changes ... */ };
    const FORM39_LABELS = { /* ... no changes ... */ };
    const FORM40_LABELS = { /* ... no changes ... */ };
    const FORM27_LABELS = { /* ... no changes ... */ };
    // --- End Label Mappings ---


    // --- PDF Generation Function (Revised with Logging) ---
    const generateFormPdf = (formData, formTitle, empNo, empName, fieldLabels) => {
        // --- Add this log ---
        console.log(`Generating PDF for: ${formTitle}`, {
            employeeNumber: empNo,
            employeeName: empName,
            dataPassedToPdf: formData // Log the actual data object
        });
        // --- End log ---

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
        // Use empName if available, otherwise try workerName from form data, else N/A
        // IMPORTANT: Ensure empName is passed correctly if available from the main 'data' prop
        const displayName = empName || formData?.workerName || 'N/A';
        doc.text(`Employee Name: ${displayName}`, margin + 80, yPos); // Adjust position as needed
        yPos += 10;
        doc.setLineWidth(0.5);
        doc.line(margin, yPos - 2, doc.internal.pageSize.getWidth() - margin, yPos - 2); // Separator line
        yPos += 8;


        // Form Data
        doc.setFontSize(10);
        const columnWidth = (doc.internal.pageSize.getWidth() - 2 * margin - 5) / 2; // Two columns with gap

        let currentX = margin;
        let column = 1;
        let startY = yPos; // Remember start Y for second column

        for (const key in fieldLabels) {
            // Ensure the key is actually defined in the labels object itself
            if (Object.hasOwnProperty.call(fieldLabels, key)) {

                // Skip emp_no and workerName from the main body as they are in the header
                // If you WANT them in the body too, remove this check.
                if (key === 'emp_no' || key === 'workerName') {
                    continue;
                }

                const label = fieldLabels[key]; // Get the display label
                let value = formData ? formData[key] : undefined; // Safely access value from formData

                // --- More robust empty check ---
                if (value === null || value === undefined || String(value).trim() === '') {
                    value = 'N/A'; // Display 'N/A' for null, undefined, or empty strings
                } else if (typeof value === 'boolean') {
                    value = value ? 'Yes' : 'No';
                } else if (typeof value === 'string') {
                    // Attempt to format date strings (YYYY-MM-DD or ISO)
                    // Check if it looks like a date *before* trying to format
                    const looksLikeDate = /^\d{4}-\d{2}-\d{2}(T.*)?$/.test(value);
                    if (looksLikeDate) {
                        const formattedDate = moment(value).isValid() ? moment.utc(value).format('DD-MMM-YYYY') : value; // Use UTC to avoid timezone shifts if time present
                        if (formattedDate !== 'Invalid date') {
                            value = formattedDate;
                        }
                    }
                    // Convert potential numeric strings if needed (usually not necessary for display)
                }
                // Ensure value is a string for PDF rendering
                const valueString = String(value);

                const textToSplit = `${label}: ${valueString}`;
                const textLines = doc.splitTextToSize(textToSplit, columnWidth - 5); // Slightly smaller width for text
                const requiredHeight = textLines.length * 5 + 3; // Height needed for this field + spacing


                // Check if content fits in the current page/column
                if (yPos + requiredHeight > doc.internal.pageSize.getHeight() - margin) {
                    if (column === 1) {
                        currentX = margin + columnWidth + 5; // Move to second column
                        yPos = startY; // Reset yPos to start of data section for this page
                        column = 2;
                        // Check again if it fits in the second column from the top
                        if (yPos + requiredHeight > doc.internal.pageSize.getHeight() - margin) {
                            // Doesn't fit even starting the second column, need new page
                            doc.addPage();
                            yPos = margin; // Reset yPos for new page
                            // Re-add Title and basic info on new page
                            doc.setFontSize(18); doc.text(formTitle, doc.internal.pageSize.getWidth() / 2, yPos, { align: 'center' }); yPos += 10;
                            doc.setFontSize(12); doc.text(`Employee No: ${empNo || 'N/A'}`, margin, yPos); doc.text(`Employee Name: ${displayName}`, margin + 80, yPos); yPos += 10;
                            doc.setLineWidth(0.5); doc.line(margin, yPos - 2, doc.internal.pageSize.getWidth() - margin, yPos - 2); yPos += 8;
                            doc.setFontSize(10);
                            startY = yPos; // Update startY for the new page
                            currentX = margin; // Back to first column
                            column = 1;
                        }

                    } else {
                        // Already in second column and it doesn't fit, add new page
                        doc.addPage();
                        yPos = margin; // Reset yPos for new page
                        // Re-add Title and basic info on new page
                        doc.setFontSize(18); doc.text(formTitle, doc.internal.pageSize.getWidth() / 2, yPos, { align: 'center' }); yPos += 10;
                        doc.setFontSize(12); doc.text(`Employee No: ${empNo || 'N/A'}`, margin, yPos); doc.text(`Employee Name: ${displayName}`, margin + 80, yPos); yPos += 10;
                        doc.setLineWidth(0.5); doc.line(margin, yPos - 2, doc.internal.pageSize.getWidth() - margin, yPos - 2); yPos += 8;
                        doc.setFontSize(10);
                        startY = yPos; // Update startY for the new page
                        currentX = margin; // Back to first column
                        column = 1;
                    }
                }

                doc.text(textLines, currentX, yPos);
                yPos += requiredHeight; // Adjust spacing between fields
            } else {
                // Log if a key from labels is unexpectedly not an own property (shouldn't happen with current setup)
                console.warn(`PDF Generation: Label key "${key}" skipped (not own property).`);
            }
        }

        // Save the PDF
        doc.save(`${formTitle.replace(/\s+/g, '_')}_${empNo || 'NoEmp'}.pdf`);
    };


    const FitnessPage = ({ data }) => {
        // Options (Keep as is)
        const allOptions = ["Height", "Gas Line", "Confined Space", "SCBA Rescuer", "Fire Rescuer", "Lone Worker", "Fisher Man", "Snake Catcher","Others"];
        const statutoryOptions = ["Select Form", "Form 17", "Form 38", "Form 39", "Form 40", "Form 27"];
        const eyeExamFitStatusOptions = ['Fit','Fit when newly prescribed glass', 'Fit with existing glass','Fit with an advice to change existing glass with newly prescribed glass','Unfit'];

        // State (Keep existing fitness assessment state)
        const [selectedOptions, setSelectedOptions] = useState([]);
        const [conditionalOptions, setConditionalOptions] = useState([]);
        const [otherJobNature, setOtherJobNature] = useState("");
        const [conditionalotherJobNature, setconditionalOtherJobNature] = useState("");
        const [overallFitness, setOverallFitness] = useState(""); // Doctor Only
        const [fitnessFormData, setFitnessFormData] = useState({
            emp_no: data?.[0]?.emp_no || '',
            tremors: "", romberg_test: "", acrophobia: "", trendelenberg_test: "",
        });
        const [systematicExamination, setSystematicExamination] = useState(""); // All Access
        const [generalExamination, setGeneralExamination] = useState(""); 
        const [eyeExamFitStatus, setEyeExamFitStatus] = useState(""); // All Access
        const [comments, setComments] = useState(""); // Doctor Only
        const [specialCases, setSpecialCases] = useState(""); // Doctor Only - NEW STATE
        const [isSubmitting, setIsSubmitting] = useState(false); // For disabling buttons during API calls

        // --- Statutory Form States (Keep as is) ---
        const initialForm17State = { emp_no: '', dept: '', worksNumber: '', workerName: '', sex: 'male', dob: '', age: '', employmentDate: '', leavingDate: '', reason: '', transferredTo: '', jobNature: '', rawMaterial: '', medicalExamDate: '', medicalExamResult: '', suspensionDetails: '', recertifiedDate: '', unfitnessCertificate: '', surgeonSignature: '', fmoSignature: '' };
        const initialForm38State = { emp_no: '', serialNumber: '', department: '', workerName: '', sex: 'male', age: '', jobNature: '', employmentDate: '', eyeExamDate: '', result: '', opthamologistSignature: '', fmoSignature: '', remarks: '' };
        const initialForm39State = { emp_no: '', serialNumber: '', workerName: '', sex: 'male', age: '', proposedEmploymentDate: '', jobOccupation: '', rawMaterialHandled: '', medicalExamDate: '', medicalExamResult: '', certifiedFit: '', certifyingSurgeonSignature: '', departmentSection: '' };
        const initialForm40State = { emp_no: '', serialNumber: '', dateOfEmployment: '', workerName: '', sex: 'male', age: '', sonWifeDaughterOf: '', natureOfJob: '', urineResult: '', bloodResult: '', fecesResult: '', xrayResult: '', otherExamResult: '', deworming: '', typhoidVaccinationDate: '', signatureOfFMO: '', remarks: '' };
        const initialForm27State = { emp_no: '', serialNumber: '', date: '', department: '', nameOfWorks: '', sex: 'male', age: '', dateOfBirth: '', nameOfTheFather: '', natureOfJobOrOccupation: '', signatureOfFMO: '', descriptiveMarks: '', signatureOfCertifyingSurgeon: '' };

        const [form17Data, setForm17Data] = useState(initialForm17State);
        const [form38Data, setForm38Data] = useState(initialForm38State);
        const [form39Data, setForm39Data] = useState(initialForm39State);
        const [form40Data, setForm40Data] = useState(initialForm40State);
        const [form27Data, setForm27Data] = useState(initialForm27State);
        const [selectedStatutoryForms, setSelectedStatutoryForms] = useState([]);

        // Get Access Level (Keep as is)
        const accessLevel = localStorage.getItem("accessLevel");

        // --- Helper Functions ---
        // Safely parse JSON array string
        const parseJsonArray = (jsonString) => {
            if (!jsonString || typeof jsonString !== 'string') {
                return [];
            }
            try {
                const parsed = JSON.parse(jsonString);
                return Array.isArray(parsed) ? parsed : [];
            } catch (error) {
                console.error("Error parsing JSON string:", jsonString, error);
                return [];
            }
        };

        // Load existing form data or initialize with default, ensuring emp_no is set
        const loadOrCreateFormState = useCallback((existingFormData, setter, defaultState, currentEmpNo) => {
            if (existingFormData) {
                // Format date fields coming from DB if they are ISO strings
                const formattedData = { ...existingFormData };
                Object.keys(formattedData).forEach(key => {
                    const value = formattedData[key];
                    // Basic check for date-like fields often stored as ISO strings
                    if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?$/)) {
                        formattedData[key] = moment(value).format('YYYY-MM-DD');
                    }
                    // Ensure boolean-like strings become actual booleans if needed, or handle appropriately
                    // Example: if (key === 'certifiedFit') formattedData[key] = value === 'true' || value === true;
                });
                // Ensure emp_no from the main data source is used
                setter({ ...defaultState, ...formattedData, emp_no: currentEmpNo });
            } else {
                setter({ ...defaultState, emp_no: currentEmpNo }); // Set current emp_no on default
            }
        }, []); // No dependencies needed as it uses arguments


        // Inside useEffect
useEffect(() => {
    const currentEmpNo = data?.[0]?.emp_no || '';

    if (data && data[0]) {
        const assessmentData = data[0].fitnessassessment;
        if (assessmentData) {
            // ... (existing state settings)
            setOverallFitness(assessmentData.overall_fitness || "");
            setComments(assessmentData.comments || "");
            setSystematicExamination(assessmentData.systematic_examination || "");
            setGeneralExamination(assessmentData.general_examination || "");
            setEyeExamFitStatus(assessmentData.eye_exam_fit_status || "");
            setSpecialCases(assessmentData.special_cases || "");

            // --- ADD THESE ---
            setOtherJobNature(assessmentData.other_job_nature || ""); // Load otherJobNature (use correct backend field name)
            setconditionalOtherJobNature(assessmentData.conditional_other_job_nature || ""); // Load conditionalotherJobNature (use correct backend field name)
            // --- END ADD ---

        } else {
            // Reset Fitness Assessment fields
            // ... (existing resets)
            setSpecialCases("");

            // --- ADD THESE ---
            setOtherJobNature(""); // Reset
            setconditionalOtherJobNature(""); // Reset
            // --- END ADD ---
        }

        // ... (load statutory forms)

    } else {
        // Reset all state if no employee data
        // ... (existing resets)
         setSpecialCases("");

         // --- ADD THESE ---
         setOtherJobNature(""); // Reset
         setconditionalOtherJobNature(""); // Reset
         // --- END ADD ---

         // ... (reset statutory forms)
    }

}, [data, loadOrCreateFormState]);

        // --- Handlers (IMPLEMENTED) ---
        const handleFitnessInputChange = (e) => { setFitnessFormData({ ...fitnessFormData, [e.target.name]: e.target.value }); };

        const handleSelectChange = (e) => {
            const value = e.target.value;
            if (value && !selectedOptions.includes(value)) {
                setSelectedOptions([...selectedOptions, value]);
            }
            e.target.value = ""; // Reset dropdown
        };
        const handleRemoveSelected = (valueToRemove) => {
            setSelectedOptions(selectedOptions.filter(option => option !== valueToRemove));
            if (valueToRemove === "Others") {
                setOtherJobNature(""); // Clear the specific text field
            }
        };

        const handleEyeExamFitStatusChange = (e) => { setEyeExamFitStatus(e.target.value); };
        const handleSystematicChange = (e) => { setSystematicExamination(e.target.value); };
        const handleGeneralExaminationChange = (e) => { setGeneralExamination(e.target.value); };

        // --- Doctor Only Handlers (IMPLEMENTED) ---
        const handleOverallFitnessChange = (e) => {
            const newFitness = e.target.value;
            setOverallFitness(newFitness);
            if (newFitness !== "conditional") {
                setConditionalOptions([]);
                setconditionalOtherJobNature(""); // Clear related 'Others' field too
            }
       };
        const handleConditionalSelectChange = (e) => {
            const value = e.target.value;
            if (value && !conditionalOptions.includes(value)) {
                setConditionalOptions([...conditionalOptions, value]);
            }
            e.target.value = ""; // Reset dropdown
        };
        const handleRemoveConditionalSelected = (valueToRemove) => {
            setConditionalOptions(conditionalOptions.filter(option => option !== valueToRemove));
             if (valueToRemove === "Others") {
                 setconditionalOtherJobNature(""); // Clear the specific text field
             }
        };
        const handleCommentsChange = (e) => { setComments(e.target.value); };
        const handleSpecialCasesChange = (e) => { setSpecialCases(e.target.value); }; // NEW HANDLER
        const handleStatutorySelectChange = (e) => {
            const formName = e.target.value;
            if (formName && formName !== "Select Form" && !selectedStatutoryForms.includes(formName)) {
                setSelectedStatutoryForms([...selectedStatutoryForms, formName]);
            }
            e.target.value = "Select Form"; // Reset dropdown after selection
        };
        const handleRemoveStatutorySelected = useCallback((formNameToRemove) => { // Use useCallback if needed elsewhere
            setSelectedStatutoryForms(prevForms => prevForms.filter(form => form !== formNameToRemove));
        }, []); // Empty dependency array, function doesn't depend on external state


        // --- Statutory Form Input Handlers (Age calculation already present) ---
        const handleForm17InputChange = (event) => {
            const { name, value } = event.target;
            setForm17Data(prevData => ({
                ...prevData,
                [name]: value,
                // Calculate age if DOB changes
                ...(name === 'dob' && value ? {
                    age: moment().diff(moment(value), 'years').toString()
                } : {})
            }));
        };
        const handleForm38InputChange = (event) => {
            const { name, value } = event.target;
            setForm38Data(prevData => ({
                ...prevData,
                [name]: value,
                // Calculate age if DOB changes
                ...(name === 'dob' && value ? {
                    age: moment().diff(moment(value), 'years').toString()
                } : {})
            }));
        };
        const handleForm39InputChange = (event) => {
            const { name, value } = event.target;
            setForm39Data(prevData => ({
                ...prevData,
                [name]: value,
                // Calculate age if DOB changes
                ...(name === 'dob' && value ? {
                    age: moment().diff(moment(value), 'years').toString()
                } : {})
            }));
        };
        const handleForm40InputChange = (event) => {
            const { name, value } = event.target;
            setForm40Data(prevData => ({
                ...prevData,
                [name]: value,
                // Calculate age if DOB changes
                ...(name === 'dob' && value ? {
                    age: moment().diff(moment(value), 'years').toString()
                } : {})
            }));
        };
        const handleForm27InputChange = (event) => {
            const { name, value } = event.target;
            setForm27Data(prevData => ({
                ...prevData,
                [name]: value,
                // Calculate age if DOB changes
                ...(name === 'dob' && value ? {
                    age: moment().diff(moment(value), 'years').toString()
                } : {})
            }));
        };
        // --- End Handlers ---

        

        // Generic submit logic
        const submitData = async (url, method, payload, successMessage, errorMessagePrefix) => {
            setIsSubmitting(true);
            console.log(`Submitting to ${url} with method ${method}`, payload); // Debug log

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    const result = await response.json(); // Assuming backend returns JSON
                    console.log(`${successMessage} Response:`, result);
                    alert(successMessage);
                    return { success: true, data: result };
                } else {
                    const errorData = await response.text(); // Get raw error text
                    console.error(`${errorMessagePrefix} Error ${response.status}:`, errorData);
                    alert(`${errorMessagePrefix} Failed. Status: ${response.status}. ${errorData}`);
                    return { success: false, error: errorData };
                }
            } catch (error) {
                console.error(`${errorMessagePrefix} Network or other error:`, error);
                alert(`${errorMessagePrefix} Network error: ${error.message}`);
                return { success: false, error: error.message };
            } finally {
                setIsSubmitting(false);
            }
        };

        // Specific submit handler for Fitness Assessment
        const handleFitnessSubmit = async () => {
            const currentEmpNo = data?.[0]?.emp_no;
            console.log("EmpNo : ",data?.[0]?.emp_no);
            if (!currentEmpNo) {
                alert("No employee selected.");
                return;
            }

            // Check if overall fitness is selected
            if (!overallFitness) {
                alert("Please select Overall Fitness status before submitting.");
                return;
            }

            // Get required fields
            const aadharNo = data?.[0]?.aadhar || '';
            const mrdNo = data?.[0]?.mrdNo || '';

            // Validate required fields
            if (!aadharNo) {
                alert("Aadhar number is required. Please ensure employee has a valid Aadhar number.");
                return;
            }

            if (!mrdNo) {
                alert("MRD number is required. Please ensure employee has a valid MRD number.");
                return;
            }

            // Determine if updating (PUT) or creating (POST)
            const existingAssessment = data?.[0]?.fitnessassessment?.fitness_assessment || false;
            const method = existingAssessment ? 'PUT' : 'POST';

            // Construct URL: Append emp_no for PUT, use base URL for POST
            const url = FITNESS_ASSESSMENT_URL; 

            const employer = data?.[0]?.type || '';
            const submittedDoctor = localStorage.getItem("userData") || '';

            // Inside handleFitnessSubmit
            const payload = {
                ...fitnessFormData,
                mrdNo: mrdNo,
                job_nature: JSON.stringify(selectedOptions),
                submittedDoctor: submittedDoctor,
                conditional_fit_feilds: JSON.stringify(conditionalOptions),
                overall_fitness: overallFitness,
                systematic_examination: systematicExamination,
                general_examination: generalExamination,
                eye_exam_fit_status: eyeExamFitStatus,
                comments: comments,
                aadhar: aadharNo,
                employer: employer,
                special_cases: specialCases,
                emp_no: currentEmpNo,
                other_job_nature: otherJobNature,
                conditional_other_job_nature: conditionalotherJobNature,
            };

            await submitData(
                url,
                method,
                payload,
                "Fitness Assessment submitted successfully!",
                "Fitness Assessment Submission"
            );
        };

        // Generic handler for submitting Statutory Forms
        const submitStatutoryForm = async (baseUrl, formData, formName, setDataState, defaultState, removeFormCallback) => {
            const currentEmpNo = data?.[0]?.emp_no;
            const aadharNo = data?.[0]?.aadhar || '';
            const employer = data?.[0]?.type || '';

            if (!aadharNo) {
                alert(`Cannot submit ${formName}. Aadhar number is missing.`);
                return;
            }

            // Always use POST method
            const method = 'POST';

            // Construct URL - Using base URL since backend will handle upsert based on aadhar
            const url = baseUrl;

            // Ensure aadhar and employer are in the payload
            const payload = { 
                ...formData, 
                aadhar: aadharNo,
                employer: employer
            };

            const result = await submitData(
                url,
                method,
                payload,
                `${formName} submitted successfully!`,
                `${formName} Submission`
            );

            if (result.success) {
                // Option 1: Keep the form visible, update its state with returned data (if any)
                if (result.data) {
                    // You might need to re-format dates/etc. from the response
                    loadOrCreateFormState(result.data, setDataState, defaultState, currentEmpNo);
                }
                // Option 2: Remove the form from the 'selected' list after successful submit
                // removeFormCallback(formName);
                // Option 3: Do nothing, just show success message. User can manually remove.
            }
        };

        // Specific Submitters for each form
        const submitForm17 = () => submitStatutoryForm(FORM17_URL, form17Data, "Form 17", setForm17Data, initialForm17State, handleRemoveStatutorySelected);
        const submitForm38 = () => submitStatutoryForm(FORM38_URL, form38Data, "Form 38", setForm38Data, initialForm38State, handleRemoveStatutorySelected);
        const submitForm39 = () => submitStatutoryForm(FORM39_URL, form39Data, "Form 39", setForm39Data, initialForm39State, handleRemoveStatutorySelected);
        const submitForm40 = () => submitStatutoryForm(FORM40_URL, form40Data, "Form 40", setForm40Data, initialForm40State, handleRemoveStatutorySelected);
        const submitForm27 = () => submitStatutoryForm(FORM27_URL, form27Data, "Form 27", setForm27Data, initialForm27State, handleRemoveStatutorySelected);
        // --- End Submit Handlers ---


        // --- Render functions for Statutory Forms (UPDATED with disabled state and submit logic) ---
        const renderForm17 = () => (
            <div className="border p-4 rounded-md bg-gray-50 shadow-inner">
                <h3 className="text-md font-semibold mb-3 text-gray-600">Form 17 Details</h3>
                <input type="hidden" name="emp_no" value={form17Data.emp_no || data?.[0]?.emp_no || ''} />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Dept */}
                    <div>
                        <label htmlFor="form17_dept" className={labelClass}>Dept</label>
                        <input type="text" id="form17_dept" name="dept" placeholder="Department" className={inputClass}
                            value={form17Data.dept || ''} onChange={handleForm17InputChange} disabled={isSubmitting} />
                    </div>
                    {/* Works Number */}
                    <div>
                        <label htmlFor="form17_worksNumber" className={labelClass}>Works Number</label>
                        <input type="text" id="form17_worksNumber" name="worksNumber" placeholder="Works Number" className={inputClass}
                            value={form17Data.worksNumber || ''} onChange={handleForm17InputChange} disabled={isSubmitting}/>
                    </div>
                    {/* Worker Name */}
                    <div>
                        <label htmlFor="form17_workerName" className={labelClass}>Worker Name</label>
                        <input type="text" id="form17_workerName" name="workerName" placeholder="Worker Name" className={inputClass}
                            value={form17Data.workerName || data?.[0]?.name || ''} onChange={handleForm17InputChange} disabled={isSubmitting} /> {/* Prefill name */}
                    </div>
                    {/* Sex */}
                    <div>
                        <label htmlFor="form17_sex" className={labelClass}>Sex</label>
                        <select id="form17_sex" name="sex" className={selectClass}
                                value={form17Data.sex || data?.[0]?.gender || 'male'} onChange={handleForm17InputChange} disabled={isSubmitting}> {/* Prefill gender */}
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    {/* Date of Birth */}
                    <div>
                        <label htmlFor="form17_dob" className={labelClass}>Date of Birth</label>
                        <input type="date" id="form17_dob" name="dob" className={inputClass}
                            value={form17Data.dob || data?.[0]?.dob || ''} onChange={handleForm17InputChange} disabled={isSubmitting}/> {/* Prefill dob */}
                    </div>
                    {/* Age (Readonly, calculated) */}
                    <div>
                        <label htmlFor="form17_age" className={labelClass}>Age</label>
                        <input type="text" id="form17_age" name="age" placeholder="Age (auto)" className={`${inputClass} bg-gray-100`}
                            value={form17Data.age || ''} readOnly /> {/* Already readonly */}
                    </div>
                    {/* Employment Date */}
                    <div>
                        <label htmlFor="form17_employmentDate" className={labelClass}>Employment Date</label>
                        <input type="date" id="form17_employmentDate" name="employmentDate" className={inputClass}
                            value={form17Data.employmentDate || ''} onChange={handleForm17InputChange} disabled={isSubmitting}/>
                    </div>
                    {/* Leaving Date */}
                    <div>
                        <label htmlFor="form17_leavingDate" className={labelClass}>Leaving Date</label>
                        <input type="date" id="form17_leavingDate" name="leavingDate" className={inputClass}
                            value={form17Data.leavingDate || ''} onChange={handleForm17InputChange} disabled={isSubmitting}/>
                    </div>
                    {/* Reason */}
                    <div>
                        <label htmlFor="form17_reason" className={labelClass}>Reason for Leaving</label>
                        <input type="text" id="form17_reason" name="reason" placeholder="Reason" className={inputClass}
                            value={form17Data.reason || ''} onChange={handleForm17InputChange} disabled={isSubmitting}/>
                    </div>
                    {/* Transferred To */}
                    <div>
                        <label htmlFor="form17_transferredTo" className={labelClass}>Transferred To</label>
                        <input type="text" id="form17_transferredTo" name="transferredTo" placeholder="Transfer Location" className={inputClass}
                            value={form17Data.transferredTo || ''} onChange={handleForm17InputChange} disabled={isSubmitting}/>
                    </div>
                    {/* Job Nature */}
                    <div>
                        <label htmlFor="form17_jobNature" className={labelClass}>Nature of Job</label>
                        <input type="text" id="form17_jobNature" name="jobNature" placeholder="Job Nature" className={inputClass}
                            value={form17Data.jobNature || data?.[0]?.designation || ''} onChange={handleForm17InputChange} disabled={isSubmitting}/> {/* Prefill job */}
                    </div>
                    {/* Raw Material */}
                    <div>
                        <label htmlFor="form17_rawMaterial" className={labelClass}>Raw Material/Product Handled</label>
                        <input type="text" id="form17_rawMaterial" name="rawMaterial" placeholder="Raw Material" className={inputClass}
                            value={form17Data.rawMaterial || ''} onChange={handleForm17InputChange} disabled={isSubmitting}/>
                    </div>
                    {/* Medical Exam Date */}
                    <div>
                        <label htmlFor="form17_medicalExamDate" className={labelClass}>Medical Exam Date</label>
                        <input type="date" id="form17_medicalExamDate" name="medicalExamDate" className={inputClass}
                            value={form17Data.medicalExamDate || ''} onChange={handleForm17InputChange} disabled={isSubmitting}/>
                    </div>
                    {/* Medical Exam Result */}
                    <div>
                        <label htmlFor="form17_medicalExamResult" className={labelClass}>Medical Exam Result</label>
                        <input type="text" id="form17_medicalExamResult" name="medicalExamResult" placeholder="Result" className={inputClass}
                            value={form17Data.medicalExamResult || ''} onChange={handleForm17InputChange} disabled={isSubmitting}/>
                    </div>
                    {/* Suspension Details */}
                    <div>
                        <label htmlFor="form17_suspensionDetails" className={labelClass}>Details of Suspension</label>
                        <input type="text" id="form17_suspensionDetails" name="suspensionDetails" placeholder="Suspension Details" className={inputClass}
                            value={form17Data.suspensionDetails || ''} onChange={handleForm17InputChange} disabled={isSubmitting}/>
                    </div>
                    {/* Recertified Date */}
                    <div>
                        <label htmlFor="form17_recertifiedDate" className={labelClass}>Recertified Date</label>
                        <input type="date" id="form17_recertifiedDate" name="recertifiedDate" className={inputClass}
                            value={form17Data.recertifiedDate || ''} onChange={handleForm17InputChange} disabled={isSubmitting}/>
                    </div>
                    {/* Unfitness Certificate */}
                    <div className="sm:col-span-2 md:col-span-1">
                        <label htmlFor="form17_unfitnessCertificate" className={labelClass}>Certificate of Unfitness</label>
                        <input type="text" id="form17_unfitnessCertificate" name="unfitnessCertificate" placeholder="Unfitness Certificate Details" className={inputClass}
                            value={form17Data.unfitnessCertificate || ''} onChange={handleForm17InputChange} disabled={isSubmitting}/>
                    </div>
                </div>
                {/* Buttons */}
                <div className="mt-4 flex justify-end items-center">
                    <button onClick={submitForm17} className={`bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Form 17'}
                    </button>
                </div>
            </div>
        );

        // --- Render other forms similarly (add disabled={isSubmitting} to inputs/buttons) ---
        const renderForm38 = () => (
            <div className="border p-4 rounded-md bg-gray-50 shadow-inner">
                <h3 className="text-md font-semibold mb-3 text-gray-600">Form 38 Details</h3>
                <input type="hidden" name="emp_no" value={form38Data.emp_no || data?.[0]?.emp_no || ''} />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Serial Number */}
                    <div>
                        <label htmlFor="form38_serialNumber" className={labelClass}>Serial Number</label>
                        <input type="text" id="form38_serialNumber" name="serialNumber" placeholder="Serial Number" className={inputClass}
                                value={form38Data.serialNumber || ''} onChange={handleForm38InputChange} disabled={isSubmitting} />
                    </div>
                    {/* Department */}
                    <div>
                        <label htmlFor="form38_department" className={labelClass}>Department/Workers</label>
                        <input type="text" id="form38_department" name="department" placeholder="Department" className={inputClass}
                                value={form38Data.department || data?.[0]?.department || ''} onChange={handleForm38InputChange} disabled={isSubmitting} /> {/* Prefill */}
                    </div>
                    {/* Worker Name */}
                    <div>
                        <label htmlFor="form38_workerName" className={labelClass}>Name of Worker</label>
                        <input type="text" id="form38_workerName" name="workerName" placeholder="Worker Name" className={inputClass}
                                value={form38Data.workerName || data?.[0]?.name || ''} onChange={handleForm38InputChange} disabled={isSubmitting} /> {/* Prefill */}
                    </div>
                    {/* Sex */}
                    <div>
                        <label htmlFor="form38_sex" className={labelClass}>Sex</label>
                        <select id="form38_sex" name="sex" className={selectClass}
                                value={form38Data.sex || data?.[0]?.gender || 'male'} onChange={handleForm38InputChange} disabled={isSubmitting}> {/* Prefill */}
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    {/* Age (Manual Input - consider prefill if dob available) */}
                    <div>
                        <label htmlFor="form38_age" className={labelClass}>Age</label>
                        <input type="number" id="form38_age" name="age" placeholder="Age" className={inputClass}
                                value={form38Data.age || (data?.[0]?.dob ? moment().diff(moment(data[0].dob), 'years') : '') || ''} onChange={handleForm38InputChange} disabled={isSubmitting} /> {/* Prefill age */}
                    </div>
                    {/* Job Nature */}
                    <div>
                        <label htmlFor="form38_jobNature" className={labelClass}>Nature of Job</label>
                        <input type="text" id="form38_jobNature" name="jobNature" placeholder="Job Nature" className={inputClass}
                                value={form38Data.jobNature || data?.[0]?.designation || ''} onChange={handleForm38InputChange} disabled={isSubmitting} /> {/* Prefill */}
                    </div>
                    {/* Employment Date */}
                    <div>
                        <label htmlFor="form38_employmentDate" className={labelClass}>Date of Employment</label>
                        <input type="date" id="form38_employmentDate" name="employmentDate" className={inputClass}
                                value={form38Data.employmentDate || ''} onChange={handleForm38InputChange} disabled={isSubmitting} />
                    </div>
                    {/* Eye Exam Date */}
                    <div>
                        <label htmlFor="form38_eyeExamDate" className={labelClass}>Date of Eye Exam</label>
                        <input type="date" id="form38_eyeExamDate" name="eyeExamDate" className={inputClass}
                                value={form38Data.eyeExamDate || ''} onChange={handleForm38InputChange} disabled={isSubmitting} />
                    </div>
                    {/* Result */}
                    <div>
                        <label htmlFor="form38_result" className={labelClass}>Result</label>
                        <input type="text" id="form38_result" name="result" placeholder="Result" className={inputClass}
                                value={form38Data.result || ''} onChange={handleForm38InputChange} disabled={isSubmitting} />
                    </div>
                    {/* Remarks */}
                    <div className="sm:col-span-2 md:col-span-3">
                        <label htmlFor="form38_remarks" className={labelClass}>Remarks</label>
                        <textarea id="form38_remarks" name="remarks" placeholder="Enter remarks" rows="2" className={inputClass}
                                    value={form38Data.remarks || ''} onChange={handleForm38InputChange} disabled={isSubmitting}></textarea>
                    </div>
                </div>
                {/* Buttons */}
                <div className="mt-4 flex justify-end items-center">
                    <button onClick={submitForm38} className={`bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Form 38'}
                    </button>
                </div>
            </div>
        );

        const renderForm39 = () => (
            <div className="border p-4 rounded-md bg-gray-50 shadow-inner">
                <h3 className="text-md font-semibold mb-3 text-gray-600">Form 39 Details</h3>
                <input type="hidden" name="emp_no" value={form39Data.emp_no || data?.[0]?.emp_no || ''} />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Serial Number */}
                    <div>
                        <label htmlFor="form39_serialNumber" className={labelClass}>Serial Number</label>
                        <input type="text" id="form39_serialNumber" name="serialNumber" placeholder="Serial Number" className={inputClass}
                                value={form39Data.serialNumber || ''} onChange={handleForm39InputChange} disabled={isSubmitting} />
                    </div>
                    {/* Worker Name */}
                    <div>
                        <label htmlFor="form39_workerName" className={labelClass}>Name of Worker</label>
                        <input type="text" id="form39_workerName" name="workerName" placeholder="Worker Name" className={inputClass}
                                value={form39Data.workerName || data?.[0]?.name || ''} onChange={handleForm39InputChange} disabled={isSubmitting} /> {/* Prefill */}
                    </div>
                    {/* Sex */}
                    <div>
                        <label htmlFor="form39_sex" className={labelClass}>Sex</label>
                        <select id="form39_sex" name="sex" className={selectClass}
                                value={form39Data.sex || data?.[0]?.gender || 'male'} onChange={handleForm39InputChange} disabled={isSubmitting}> {/* Prefill */}
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    {/* Age */}
                    <div>
                        <label htmlFor="form39_age" className={labelClass}>Age</label>
                        <input type="number" id="form39_age" name="age" placeholder="Age" className={inputClass}
                                value={form39Data.age || (data?.[0]?.dob ? moment().diff(moment(data[0].dob), 'years') : '') || ''} onChange={handleForm39InputChange} disabled={isSubmitting} /> {/* Prefill */}
                    </div>
                    {/* Proposed Employment Date */}
                    <div>
                        <label htmlFor="form39_proposedEmploymentDate" className={labelClass}>Date of Proposed Employment</label>
                        <input type="date" id="form39_proposedEmploymentDate" name="proposedEmploymentDate" className={inputClass}
                                value={form39Data.proposedEmploymentDate || ''} onChange={handleForm39InputChange} disabled={isSubmitting} />
                    </div>
                    {/* Job Occupation */}
                    <div>
                        <label htmlFor="form39_jobOccupation" className={labelClass}>Job Occupation</label>
                        <input type="text" id="form39_jobOccupation" name="jobOccupation" placeholder="Job Occupation" className={inputClass}
                                value={form39Data.jobOccupation || data?.[0]?.designation || ''} onChange={handleForm39InputChange} disabled={isSubmitting} /> {/* Prefill */}
                    </div>
                    {/* Raw Material Handled */}
                    <div>
                        <label htmlFor="form39_rawMaterialHandled" className={labelClass}>Raw Material Handled</label>
                        <input type="text" id="form39_rawMaterialHandled" name="rawMaterialHandled" placeholder="Raw Material" className={inputClass}
                                value={form39Data.rawMaterialHandled || ''} onChange={handleForm39InputChange} disabled={isSubmitting} />
                    </div>
                    {/* Medical Exam Date */}
                    <div>
                        <label htmlFor="form39_medicalExamDate" className={labelClass}>Date of Medical Examination</label>
                        <input type="date" id="form39_medicalExamDate" name="medicalExamDate" className={inputClass}
                                value={form39Data.medicalExamDate || ''} onChange={handleForm39InputChange} disabled={isSubmitting} />
                    </div>
                    {/* Medical Exam Result */}
                    <div>
                        <label htmlFor="form39_medicalExamResult" className={labelClass}>Result of Medical Examination</label>
                        <input type="text" id="form39_medicalExamResult" name="medicalExamResult" placeholder="Result" className={inputClass}
                                value={form39Data.medicalExamResult || ''} onChange={handleForm39InputChange} disabled={isSubmitting} />
                    </div>
                    {/* Certified Fit */}
                    <div>
                        <label htmlFor="form39_certifiedFit" className={labelClass}>Certified Fit/Unfit</label>
                        <select id="form39_certifiedFit" name="certifiedFit" className={selectClass}
                                value={form39Data.certifiedFit || ''} onChange={handleForm39InputChange} disabled={isSubmitting}>
                            <option value="" disabled>Select Status</option>
                            <option value="fit">Fit</option>
                            <option value="unfit">Unfit</option>
                            <option value="conditional">Conditional</option>
                        </select>
                    </div>
                    {/* Department/Section */}
                    <div className="sm:col-span-2 md:col-span-1">
                        <label htmlFor="form39_departmentSection" className={labelClass}>Department/Section/Works No.</label>
                        <input type="text" id="form39_departmentSection" name="departmentSection" placeholder="Dept/Section" className={inputClass}
                                value={form39Data.departmentSection || data?.[0]?.department || ''} onChange={handleForm39InputChange} disabled={isSubmitting} /> {/* Prefill */}
                    </div>
                </div>
                {/* Buttons */}
                <div className="mt-4 flex justify-end items-center">
                    <button onClick={submitForm39} className={`bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Form 39'}
                    </button>
                </div>
            </div>
        );

        const renderForm40 = () => (
            <div className="border p-4 rounded-md bg-gray-50 shadow-inner">
                <h3 className="text-md font-semibold mb-3 text-gray-600">Form 40 Details</h3>
                <input type="hidden" name="emp_no" value={form40Data.emp_no || data?.[0]?.emp_no || ''} />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Serial Number */}
                    <div>
                        <label htmlFor="form40_serialNumber" className={labelClass}>Serial Number</label>
                        <input type="text" id="form40_serialNumber" name="serialNumber" placeholder="Serial Number" className={inputClass}
                                value={form40Data.serialNumber || ''} onChange={handleForm40InputChange} disabled={isSubmitting} />
                    </div>
                    {/* Date of Employment */}
                    <div>
                        <label htmlFor="form40_dateOfEmployment" className={labelClass}>Date of Employment</label>
                        <input type="date" id="form40_dateOfEmployment" name="dateOfEmployment" className={inputClass}
                                value={form40Data.dateOfEmployment || ''} onChange={handleForm40InputChange} disabled={isSubmitting} />
                    </div>
                    {/* Worker Name */}
                    <div>
                        <label htmlFor="form40_workerName" className={labelClass}>Name of Worker</label>
                        <input type="text" id="form40_workerName" name="workerName" placeholder="Worker Name" className={inputClass}
                                value={form40Data.workerName || data?.[0]?.name || ''} onChange={handleForm40InputChange} disabled={isSubmitting} /> {/* Prefill */}
                    </div>
                    {/* Sex */}
                    <div>
                        <label htmlFor="form40_sex" className={labelClass}>Sex</label>
                        <select id="form40_sex" name="sex" className={selectClass}
                                value={form40Data.sex || data?.[0]?.gender || 'male'} onChange={handleForm40InputChange} disabled={isSubmitting}> {/* Prefill */}
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    {/* Age */}
                    <div>
                        <label htmlFor="form40_age" className={labelClass}>Age</label>
                        <input type="number" id="form40_age" name="age" placeholder="Age" className={inputClass}
                                value={form40Data.age || (data?.[0]?.dob ? moment().diff(moment(data[0].dob), 'years') : '') || ''} onChange={handleForm40InputChange} disabled={isSubmitting} /> {/* Prefill */}
                    </div>
                    {/* Son/Wife/Daughter Of */}
                    <div>
                        <label htmlFor="form40_sonWifeDaughterOf" className={labelClass}>Son/Wife/Daughter Of</label>
                        <input type="text" id="form40_sonWifeDaughterOf" name="sonWifeDaughterOf" placeholder="Parent/Spouse Name" className={inputClass}
                                value={form40Data.sonWifeDaughterOf || ''} onChange={handleForm40InputChange} disabled={isSubmitting} />
                    </div>
                    {/* Nature of Job */}
                    <div>
                        <label htmlFor="form40_natureOfJob" className={labelClass}>Nature of Job</label>
                        <input type="text" id="form40_natureOfJob" name="natureOfJob" placeholder="Job Nature" className={inputClass}
                                value={form40Data.natureOfJob || data?.[0]?.designation || ''} onChange={handleForm40InputChange} disabled={isSubmitting} /> {/* Prefill */}
                    </div>
                    {/* Urine Result */}
                    <div>
                        <label htmlFor="form40_urineResult" className={labelClass}>Urine Result</label>
                        <input type="text" id="form40_urineResult" name="urineResult" placeholder="Urine Result" className={inputClass}
                                value={form40Data.urineResult || ''} onChange={handleForm40InputChange} disabled={isSubmitting} />
                    </div>
                    {/* Blood Result */}
                    <div>
                        <label htmlFor="form40_bloodResult" className={labelClass}>Blood Result</label>
                        <input type="text" id="form40_bloodResult" name="bloodResult" placeholder="Blood Result" className={inputClass}
                                value={form40Data.bloodResult || ''} onChange={handleForm40InputChange} disabled={isSubmitting} />
                    </div>
                    {/* Feces Result */}
                    <div>
                        <label htmlFor="form40_fecesResult" className={labelClass}>Feces Result</label>
                        <input type="text" id="form40_fecesResult" name="fecesResult" placeholder="Feces Result" className={inputClass}
                                value={form40Data.fecesResult || ''} onChange={handleForm40InputChange} disabled={isSubmitting} />
                    </div>
                    {/* X-Ray Result */}
                    <div>
                        <label htmlFor="form40_xrayResult" className={labelClass}>X-Ray Result</label>
                        <input type="text" id="form40_xrayResult" name="xrayResult" placeholder="X-Ray Result" className={inputClass}
                                value={form40Data.xrayResult || ''} onChange={handleForm40InputChange} disabled={isSubmitting} />
                    </div>
                    {/* Other Exam Result */}
                    <div>
                        <label htmlFor="form40_otherExamResult" className={labelClass}>Other Examination Result</label>
                        <input type="text" id="form40_otherExamResult" name="otherExamResult" placeholder="Other Result" className={inputClass}
                                value={form40Data.otherExamResult || ''} onChange={handleForm40InputChange} disabled={isSubmitting} />
                    </div>
                    {/* Deworming */}
                    <div>
                        <label htmlFor="form40_deworming" className={labelClass}>Deworming Details</label>
                        <input type="text" id="form40_deworming" name="deworming" placeholder="Deworming" className={inputClass}
                                value={form40Data.deworming || ''} onChange={handleForm40InputChange} disabled={isSubmitting} />
                    </div>
                    {/* Typhoid Vaccination Date */}
                    <div>
                        <label htmlFor="form40_typhoidVaccinationDate" className={labelClass}>Typhoid Vaccination Date</label>
                        <input type="date" id="form40_typhoidVaccinationDate" name="typhoidVaccinationDate" className={inputClass}
                                value={form40Data.typhoidVaccinationDate || ''} onChange={handleForm40InputChange} disabled={isSubmitting} />
                    </div>
                    {/* Remarks */}
                    <div className="sm:col-span-2">
                        <label htmlFor="form40_remarks" className={labelClass}>Remarks</label>
                        <input type="text" id="form40_remarks" name="remarks" placeholder="Remarks" className={inputClass}
                                value={form40Data.remarks || ''} onChange={handleForm40InputChange} disabled={isSubmitting} />
                    </div>
                </div>
                {/* Buttons */}
                <div className="mt-4 flex justify-end items-center">
                    <button onClick={submitForm40} className={`bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Form 40'}
                    </button>
                </div>
            </div>
        );

        const renderForm27 = () => (
            <div className="border p-4 rounded-md bg-gray-50 shadow-inner">
                <h3 className="text-md font-semibold mb-3 text-gray-600">Form 27 Details</h3>
                <input type="hidden" name="emp_no" value={form27Data.emp_no || data?.[0]?.emp_no || ''} />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Serial Number */}
                    <div>
                        <label htmlFor="form27_serialNumber" className={labelClass}>Serial Number</label>
                        <input type="text" id="form27_serialNumber" name="serialNumber" placeholder="Serial Number" className={inputClass}
                                value={form27Data.serialNumber || ''} onChange={handleForm27InputChange} disabled={isSubmitting} />
                    </div>
                    {/* Date */}
                    <div>
                        <label htmlFor="form27_date" className={labelClass}>Date</label>
                        <input type="date" id="form27_date" name="date" className={inputClass}
                                value={form27Data.date || ''} onChange={handleForm27InputChange} disabled={isSubmitting} />
                    </div>
                    {/* Department */}
                    <div>
                        <label htmlFor="form27_department" className={labelClass}>Department</label>
                        <input type="text" id="form27_department" name="department" placeholder="Department" className={inputClass}
                                value={form27Data.department || data?.[0]?.department || ''} onChange={handleForm27InputChange} disabled={isSubmitting} /> {/* Prefill */}
                    </div>
                    {/* Name of Works */}
                    <div>
                        <label htmlFor="form27_nameOfWorks" className={labelClass}>Name of Works</label>
                        <input type="text" id="form27_nameOfWorks" name="nameOfWorks" placeholder="Name of Works" className={inputClass}
                                value={form27Data.nameOfWorks || ''} onChange={handleForm27InputChange} disabled={isSubmitting} />
                    </div>
                    {/* Sex */}
                    <div>
                        <label htmlFor="form27_sex" className={labelClass}>Sex</label>
                        <select id="form27_sex" name="sex" className={selectClass}
                                value={form27Data.sex || data?.[0]?.gender || 'male'} onChange={handleForm27InputChange} disabled={isSubmitting}> {/* Prefill */}
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    {/* Age */}
                    <div>
                        <label htmlFor="form27_age" className={labelClass}>Age</label>
                        <input type="number" id="form27_age" name="age" placeholder="Age" className={inputClass}
                                value={form27Data.age || (data?.[0]?.dob ? moment().diff(moment(data[0].dob), 'years') : '') || ''} onChange={handleForm27InputChange} disabled={isSubmitting} /> {/* Prefill */}
                    </div>
                    {/* Date of Birth */}
                    <div>
                        <label htmlFor="form27_dateOfBirth" className={labelClass}>Date of Birth</label>
                        <input type="date" id="form27_dateOfBirth" name="dateOfBirth" className={inputClass}
                                value={form27Data.dateOfBirth || data?.[0]?.dob || ''} onChange={handleForm27InputChange} disabled={isSubmitting} /> {/* Prefill */}
                    </div>
                    {/* Name of the Father */}
                    <div>
                        <label htmlFor="form27_nameOfTheFather" className={labelClass}>Father's Name</label>
                        <input type="text" id="form27_nameOfTheFather" name="nameOfTheFather" placeholder="Father's Name" className={inputClass}
                                value={form27Data.nameOfTheFather || ''} onChange={handleForm27InputChange} disabled={isSubmitting} />
                    </div>
                    {/* Nature of Job/Occupation */}
                    <div>
                        <label htmlFor="form27_natureOfJobOrOccupation" className={labelClass}>Nature of Job/Occupation</label>
                        <input type="text" id="form27_natureOfJobOrOccupation" name="natureOfJobOrOccupation" placeholder="Job/Occupation" className={inputClass}
                                value={form27Data.natureOfJobOrOccupation || data?.[0]?.designation || ''} onChange={handleForm27InputChange} disabled={isSubmitting} /> {/* Prefill */}
                    </div>
                    {/* Descriptive Marks */}
                    <div className="sm:col-span-2 md:col-span-1">
                        <label htmlFor="form27_descriptiveMarks" className={labelClass}>Descriptive Marks</label>
                        <input type="text" id="form27_descriptiveMarks" name="descriptiveMarks" placeholder="Descriptive Marks" className={inputClass}
                                value={form27Data.descriptiveMarks || ''} onChange={handleForm27InputChange} disabled={isSubmitting} />
                    </div>
                </div>
                {/* Buttons */}
                <div className="mt-4 flex justify-end items-center">
                    <button onClick={submitForm27} className={`bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Form 27'}
                    </button>
                </div>
            </div>
        );
        // --- End Render Functions ---


        // Main Return structure (Add disabled state to buttons/inputs)
        return (
            <div className="bg-gray-50 min-h-screen p-4 md:p-6 relative">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-800 border-b pb-2">Fitness Assessment</h1>

                {/* Fitness Tests Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                    {["tremors", "romberg_test", "acrophobia", "trendelenberg_test"].map((test) => (
                        <div key={test} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                            <h2 className="text-base md:text-lg font-semibold mb-3 text-gray-700">{test.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</h2>
                            <div className="space-y-2">
                                {["positive", "negative"].map((value) => (
                                    <label key={value} className="flex items-center space-x-3 cursor-pointer text-gray-600 hover:text-gray-900 text-sm">
                                        <input
                                            type="radio" name={test} value={value}
                                            className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                            checked={fitnessFormData[test] === value}
                                            onChange={handleFitnessInputChange}
                                            disabled={!data?.[0]?.emp_no || isSubmitting} // Disable if no employee or submitting
                                        />
                                        <span className="capitalize">{value}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Eye Examination Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                        
                        {/* Eye Exam Fit Status */}
                        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                            <label htmlFor="eyeExamFitStatus" className="block text-base md:text-lg font-semibold mb-3 text-gray-700">Eye Examination by OPHTHALMOLOGIST </label>
                            <select id="eyeExamFitStatus" name="eyeExamFitStatus" value={eyeExamFitStatus} onChange={handleEyeExamFitStatusChange}
                                disabled={!data?.[0]?.emp_no || isSubmitting} // Disable
                                className={selectClass + ` ${!data?.[0]?.emp_no || isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                title={!data?.[0]?.emp_no ? "Select an employee first" : ""}>
                                {eyeExamFitStatusOptions.map(option => ( <option key={option} value={option} disabled={option === ""}>{option || "-- Select Status --"}</option> ))}
                            </select>
                        </div>
                    </div>

                {/* Combined Section */}
                <div className="bg-white p-4 md:p-6 rounded-lg shadow border border-gray-200 mb-6 md:mb-8">
                    {/* Job Nature */}
                    <div className="mb-6">
                        <h2 className="text-base md:text-lg font-semibold mb-2 text-gray-700">Fitness applied for (Job nature)</h2>
                        <select
                            className={selectClass + ` mb-3 ${!data?.[0]?.emp_no || isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            onChange={handleSelectChange} value=""
                            disabled={!data?.[0]?.emp_no || isSubmitting} // Disable
                            title={!data?.[0]?.emp_no ? "Select an employee first" : "Select job nature"}>
                            <option value="" disabled>-- Select an option to add --</option>
                            {allOptions.map((option, index) => ( <option key={index} value={option} disabled={selectedOptions.includes(option)}>{option}</option> ))}
                        </select>
                        <div className="flex flex-wrap gap-2 min-h-[30px]"> {/* Added min-height */}
                            {selectedOptions.length > 0 ? (
                                selectedOptions.map((option, index) => (
                                    <div key={index} className="flex items-center pl-3 pr-2 py-1 border border-blue-300 rounded-full bg-blue-50 text-xs md:text-sm text-blue-800 shadow-sm">
                                        <span>{option}</span>
                                        <button type="button" className={`ml-2 text-red-500 hover:text-red-700 font-bold text-xs ${isSubmitting ? 'cursor-not-allowed' : ''}`} onClick={() => !isSubmitting && handleRemoveSelected(option)} title={`Remove ${option}`} disabled={isSubmitting}>×</button> {/* Disable remove button */}
                                    </div>
                                ))
                            ) : ( <p className="text-sm text-gray-500 italic w-full">No specific job nature selected.</p> )}
                        </div>
                        {selectedOptions.includes("Others") && (
                            <div className="mt-4">
                                <label htmlFor="otherJobNature" className={labelClass}>Specify Other Job Nature:</label>
                                <input
                                    type="text"
                                    id="otherJobNature"
                                    name="otherJobNature"
                                    value={otherJobNature}
                                    onChange={(e)=>{setOtherJobNature(e.target.value)}}
                                    disabled={isSubmitting}
                                    className={inputClass}
                                    placeholder="Enter details for 'Others'"
                                />
                            </div>
                        )}
                    </div>

                    {/* General Examination */}
                    <div className="mt-6 mb-6">
                            <label htmlFor="generalExamination" className={labelClass}>General Examination</label>
                            <textarea id="generalExamination" name="generalExamination" rows="3" value={generalExamination}
                            onChange={handleGeneralExaminationChange}
                            disabled={!data?.[0]?.emp_no || isSubmitting} // Disable
                            className={inputClass + ` ${!data?.[0]?.emp_no || isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            title={!data?.[0]?.emp_no ? "Select an employee first" : "Add General Examination details"}
                            placeholder="Enter General Examination details here"
                            />
                        </div>

                        {/* Systematic Examination */}
                        <div className="mt-6 mb-6">
                            <label htmlFor="systematicExamination" className={labelClass}>Systemic Examination</label>
                            <textarea id="systematicExamination" name="systematicExamination" rows="3" value={systematicExamination}
                            onChange={handleSystematicChange}
                            disabled={!data?.[0]?.emp_no || isSubmitting} // Disable
                            className={inputClass + ` ${!data?.[0]?.emp_no || isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            title={!data?.[0]?.emp_no ? "Select an employee first" : "Add Systematic Examination details (CVS, RS, GIT, CNS, etc)"}
                            placeholder="Enter Systematic Examination details (CVS, RS, GIT, CNS, etc)"
                            />
                        </div>

                    {/* --- Doctor Only Fields --- */}
                    {accessLevel === "doctor" && (
                        <div className="border-t pt-6 mt-6 space-y-6">
                            {/* Overall Fitness */}
                            <div>
                                <label className={labelClass}>Fit for (Job Nature)</label>
                                <select value={overallFitness} onChange={handleOverallFitnessChange}
                                    disabled={!data?.[0]?.emp_no || isSubmitting} // Disable
                                    className={selectClass + ` ${!data?.[0]?.emp_no || isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    title={!data?.[0]?.emp_no ? "Select an employee first" : "Set overall fitness"}>
                                    <option value="" disabled>-- Select status --</option>
                                    <option value="fit">Fit</option>
                                    <option value="unfit">Unfit</option>
                                    <option value="conditional">Conditional Fit</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>

                            {/* Conditional Fit Section */}
                            {overallFitness === "conditional" && (
                                <div className="pl-4 border-l-4 border-blue-300 py-3 bg-blue-50 rounded-r-md space-y-3">
                                    <h3 className="text-md font-semibold text-gray-700">Conditionally Fit For (Select applicable)</h3>
                                    <select value="" onChange={handleConditionalSelectChange}
                                        disabled={!data?.[0]?.emp_no || isSubmitting} // Disable
                                        className={selectClass}>
                                        <option value="" disabled>-- Select an option to add --</option>
                                        {allOptions.map((option, index) => ( <option key={index} value={option} disabled={conditionalOptions.includes(option)}>{option}</option> ))}
                                    </select>
                                    <div className="flex flex-wrap gap-2 min-h-[30px]"> {/* Added min-height */}
                                        {conditionalOptions.length > 0 ? (
                                            conditionalOptions.map((option, index) => (
                                                <div key={index} className="flex items-center pl-3 pr-2 py-1 border border-green-300 rounded-full bg-green-50 text-xs md:text-sm text-green-800 shadow-sm">
                                                    <span>{option}</span>
                                                    <button type="button" className={`ml-2 text-red-500 hover:text-red-700 font-bold text-xs ${isSubmitting ? 'cursor-not-allowed' : ''}`} onClick={() => !isSubmitting && handleRemoveConditionalSelected(option)} title={`Remove ${option}`} disabled={isSubmitting}>×</button> {/* Disable remove */}
                                                </div>
                                            ))
                                        ) : ( <p className="text-sm text-gray-500 italic w-full">Specify conditions.</p> )}
                                    </div>
                                    {conditionalOptions.includes("Others") && (
                            <div className="mt-4">
                                <label htmlFor="otherJobNature" className={labelClass}>Specify Other Job Nature:</label>
                                <input
                                    type="text"
                                    id="conditionalotherJobNature"
                                    name="conditionalotherJobNature"
                                    value={conditionalotherJobNature}
                                    onChange={(e)=>{setconditionalOtherJobNature(e.target.value)}}
                                    disabled={isSubmitting}
                                    className={inputClass}
                                    placeholder="Enter details for 'Others'"
                                />
                            </div>
                        )}
                                </div>
                            )}

                            {/* Comments */}
                            <div>
                                <label htmlFor="comments" className={labelClass}>Doctor's Remarks / Comments</label>
                                <textarea id="comments" rows="3" value={comments} onChange={handleCommentsChange}
                                    disabled={!data?.[0]?.emp_no || isSubmitting} // Disable
                                    className={inputClass + ` ${!data?.[0]?.emp_no || isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    title={!data?.[0]?.emp_no ? "Select an employee first" : "Add comments"}
                                    placeholder="Enter any relevant comments..."
                                />
                            </div>

                            {/* --- Special Cases Section (NEW) --- */}
                            <div className="mt-4">
                                <label className={labelClass}>Special Cases</label>
                                <div className="flex space-x-4 mt-2">
                                    {["Yes", "No", "N/A"].map((value) => (
                                        <label key={value} className="flex items-center space-x-2 cursor-pointer text-gray-600 hover:text-gray-900 text-sm">
                                            <input
                                                type="radio"
                                                name="specialCases"
                                                value={value}
                                                className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                checked={specialCases === value}
                                                onChange={handleSpecialCasesChange}
                                                disabled={!data?.[0]?.emp_no || isSubmitting}
                                                title={!data?.[0]?.emp_no ? "Select an employee first" : ""}
                                            />
                                            <span>{value}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            {/* --- End Special Cases Section --- */}
                        </div>
                    )}
                    {/* --- End Doctor Only Fields --- */}

                    {/* Submit Button for Fitness Assessment */}
                    <div className="w-full flex justify-end mt-6 border-t pt-6">
                        <button
                            className={`bg-blue-600 text-white px-5 py-2 md:px-6 md:py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 font-medium text-sm md:text-base ${!data?.[0]?.emp_no || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleFitnessSubmit}
                            disabled={!data?.[0]?.emp_no || isSubmitting} // Disable
                            title={!data?.[0]?.emp_no ? "Cannot submit without employee data" : "Submit fitness assessment"}>
                            {isSubmitting ? 'Submitting...' : 'Submit Fitness Assessment'}
                        </button>
                    </div>
                </div>


                {/* Statutory Forms Section (Doctor Only) */}
                    {accessLevel === "doctor" && (
                    <>
                        <h1 className="text-2xl md:text-3xl font-bold my-6 md:my-8 text-gray-800 border-b pb-2">Statutory Forms</h1>
                        <div className="bg-white p-4 md:p-6 rounded-lg shadow border border-gray-200 mb-6 md:mb-8">
                            <h2 className="text-base md:text-lg font-semibold mb-4 text-gray-700">Select Forms to Fill / Generate PDF</h2>
                            <select value="Select Form" onChange={handleStatutorySelectChange}
                                disabled={!data?.[0]?.emp_no || isSubmitting} // Disable
                                className={selectClass + ` mb-4 ${!data?.[0]?.emp_no || isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                title={!data?.[0]?.emp_no ? "Select an employee first" : "Select a form"}>
                                {statutoryOptions.map((option, index) => ( <option key={index} value={option} disabled={option === "Select Form" || selectedStatutoryForms.includes(option)}>{option}</option> ))}
                            </select>

                            {/* Display selected forms tags */}
                            <div className="flex flex-wrap gap-2 mt-4 mb-6 border-t pt-4 min-h-[30px]"> {/* Added min-height */}
                                {selectedStatutoryForms.length > 0 ? (
                                    selectedStatutoryForms.map((option, index) => (
                                        <div key={index} className="flex items-center pl-3 pr-2 py-1 border border-gray-300 rounded-full bg-gray-100 text-xs md:text-sm text-gray-800 shadow-sm">
                                            <span>{option}</span>
                                            <button type="button" className={`ml-2 text-red-500 hover:text-red-700 font-bold text-xs ${isSubmitting ? 'cursor-not-allowed' : ''}`} onClick={() => !isSubmitting && handleRemoveStatutorySelected(option)} title={`Remove ${option}`} disabled={isSubmitting}>×</button> {/* Disable remove */}
                                        </div>
                                    ))
                                ) : ( <p className="text-sm text-gray-500 italic w-full">No statutory forms selected to display/fill.</p> )}
                            </div>
                            {/* Remove console.log */}
                            {/* Render the actual form components */}
                            {
                            Array.isArray(selectedStatutoryForms) && selectedStatutoryForms.length > 0 && (
                                <div className="flex flex-col space-y-6 mt-4">
                                    {/* Render functions already updated */}
                                    {selectedStatutoryForms.includes("Form 17") && renderForm17()}
                                    {selectedStatutoryForms.includes("Form 38") && renderForm38()}
                                    {selectedStatutoryForms.includes("Form 39") && renderForm39()}
                                    {selectedStatutoryForms.includes("Form 40") && renderForm40()}
                                    {selectedStatutoryForms.includes("Form 27") && renderForm27()}
                                </div>
                            )}
                        </div>

                        {/* Significant Notes Component (Rendered only if data exists) */}
                        {data && data[0] && <SignificantNotes data={data} />}
                    </>
                    )}
            </div>
        );
    };

    export default FitnessPage;