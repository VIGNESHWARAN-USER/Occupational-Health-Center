import React, { useState, useEffect, useCallback } from "react";
import moment from 'moment';
import jsPDF from 'jspdf'; // Ensure jspdf is installed: npm install jspdf
import SignificantNotes from "./SignificantNotes"; // Assuming this component exists
import MedicalCertificateForm from "./MedicalCertificateForm";
import PersonalLeaveCertificateForm from "./PersonalLeaveCertificateForm";
import axios from "axios";

// URLs (Keep as is)
const FITNESS_ASSESSMENT_URL = "http://localhost:8000/fitness-tests/";
const FORM17_URL = "http://localhost:8000/form17/";
const FORM38_URL = "http://localhost:8000/form38/";
const FORM39_URL = "http://localhost:8000/form39/";
const FORM40_URL = "http://localhost:8000/form40/";
const FORM27_URL = "http://localhost:8000/form27/";

// --- Standard Input/Select Class ---
const inputClass = "form-input block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm";
const selectClass = "form-select block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm";
const labelClass = "block text-sm font-medium text-gray-700";
const inputClasses = `w-full p-3 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100 disabled:cursor-not-allowed`;

// --- Reusable Form Components for Medical Certificate ---
const FormInput = ({ label, name, type = 'text', value, onChange, className = '' }) => (
    <div className={className}>
        <label htmlFor={name} className={labelClass}>{label}</label>
        <input type={type} id={name} name={name} value={value} onChange={onChange} className={inputClass} />
    </div>
);

const FormTextarea = ({ label, name, value, onChange, className = '' }) => (
    <div className={className}>
        <label htmlFor={name} className={labelClass}>{label}</label>
        <textarea id={name} name={name} value={value} onChange={onChange} rows="3" className={inputClass}></textarea>
    </div>
);

const FormSelect = ({ label, name, value, onChange, options, placeholder, className = '' }) => (
    <div className={className}>
        <label htmlFor={name} className={labelClass}>{label}</label>
        <select id={name} name={name} value={value} onChange={onChange} className={selectClass}>
            {placeholder && <option value="">{placeholder}</option>}
            {options.map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
    </div>
);



const FormRadioGroup = ({ label, name, value, onChange, options, className = '' }) => (
    <div className={className}>
        <label className={labelClass}>{label}</label>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
            {options.map(option => (
                <label key={option} className="inline-flex items-center">
                    <input
                        type="radio"
                        name={name}
                        value={option}
                        checked={value === option}
                        onChange={onChange}
                        className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{option}</span>
                </label>
            ))}
        </div>
    </div>
);


// --- Label Mappings (EXPANDED - Keep as is, fill these for PDF generation) ---
const FORM17_LABELS = { /* emp_no: 'Employee No', dept: 'Department', ... */ };
const FORM38_LABELS = { /* emp_no: 'Employee No', serialNumber: 'Serial No.', ... */ };
const FORM39_LABELS = { /* ... */ };
const FORM40_LABELS = { /* ... */ };
const FORM27_LABELS = { /* ... */ };
// --- End Label Mappings ---


// --- PDF Generation Function (Revised with Logging) ---
const generateFormPdf = (formData, formTitle, empNo, empName, fieldLabels) => {
    console.log(`Generating PDF for: ${formTitle}`, {
        employeeNumber: empNo,
        employeeName: empName,
        dataPassedToPdf: formData
    });

    const doc = new jsPDF();
    const margin = 15;
    let yPos = margin;

    doc.setFontSize(18);
    doc.text(formTitle, doc.internal.pageSize.getWidth() / 2, yPos, { align: 'center' });
    yPos += 10;

    doc.setFontSize(12);
    doc.text(`Employee No: ${empNo || 'N/A'}`, margin, yPos);
    const displayName = empName || formData?.workerName || 'N/A';
    doc.text(`Employee Name: ${displayName}`, margin + 80, yPos);
    yPos += 10;
    doc.setLineWidth(0.5);
    doc.line(margin, yPos - 2, doc.internal.pageSize.getWidth() - margin, yPos - 2);
    yPos += 8;

    doc.setFontSize(10);
    const columnWidth = (doc.internal.pageSize.getWidth() - 2 * margin - 5) / 2;
    let currentX = margin;
    let column = 1;
    let startY = yPos;

    for (const key in fieldLabels) {
        if (Object.hasOwnProperty.call(fieldLabels, key)) {
            if (key === 'emp_no' || key === 'workerName') {
                continue;
            }

            const label = fieldLabels[key];
            let value = formData ? formData[key] : undefined;

            if (value === null || value === undefined || String(value).trim() === '') {
                value = 'N/A';
            } else if (typeof value === 'boolean') {
                value = value ? 'Yes' : 'No';
            } else if (typeof value === 'string') {
                const looksLikeDate = /^\d{4}-\d{2}-\d{2}(T.*)?$/.test(value);
                if (looksLikeDate) {
                    const formattedDate = moment(value).isValid() ? moment.utc(value).format('DD-MMM-YYYY') : value;
                    if (formattedDate !== 'Invalid date') {
                        value = formattedDate;
                    }
                }
            }
            const valueString = String(value);
            const textToSplit = `${label}: ${valueString}`;
            const textLines = doc.splitTextToSize(textToSplit, columnWidth - 5);
            const requiredHeight = textLines.length * 5 + 3;

            if (yPos + requiredHeight > doc.internal.pageSize.getHeight() - margin) {
                if (column === 1) {
                    currentX = margin + columnWidth + 5;
                    yPos = startY;
                    column = 2;
                    if (yPos + requiredHeight > doc.internal.pageSize.getHeight() - margin) {
                        doc.addPage();
                        yPos = margin;
                        doc.setFontSize(18); doc.text(formTitle, doc.internal.pageSize.getWidth() / 2, yPos, { align: 'center' }); yPos += 10;
                        doc.setFontSize(12); doc.text(`Employee No: ${empNo || 'N/A'}`, margin, yPos); doc.text(`Employee Name: ${displayName}`, margin + 80, yPos); yPos += 10;
                        doc.setLineWidth(0.5); doc.line(margin, yPos - 2, doc.internal.pageSize.getWidth() - margin, yPos - 2); yPos += 8;
                        doc.setFontSize(10);
                        startY = yPos;
                        currentX = margin;
                        column = 1;
                    }
                } else {
                    doc.addPage();
                    yPos = margin;
                    doc.setFontSize(18); doc.text(formTitle, doc.internal.pageSize.getWidth() / 2, yPos, { align: 'center' }); yPos += 10;
                    doc.setFontSize(12); doc.text(`Employee No: ${empNo || 'N/A'}`, margin, yPos); doc.text(`Employee Name: ${displayName}`, margin + 80, yPos); yPos += 10;
                    doc.setLineWidth(0.5); doc.line(margin, yPos - 2, doc.internal.pageSize.getWidth() - margin, yPos - 2); yPos += 8;
                    doc.setFontSize(10);
                    startY = yPos;
                    currentX = margin;
                    column = 1;
                }
            }
            doc.text(textLines, currentX, yPos);
            yPos += requiredHeight;
        } else {
            console.warn(`PDF Generation: Label key "${key}" skipped (not own property).`);
        }
    }
    doc.save(`${formTitle.replace(/\s+/g, '_')}_${empNo || 'NoEmp'}.pdf`);
};

// --- Configuration for all fitness tests ---
const allFitnessTestsConfig = [
    { key: "tremors", displayName: "Tremors", options: ["positive", "negative"] },
    { key: "romberg_test", displayName: "Romberg Test", options: ["positive", "negative"] },
    { key: "acrophobia", displayName: "Fear Of Height (Acrophobia)", options: ["Yes", "No"] }, // Options Yes/No
    { key: "trendelenberg_test", displayName: "Trendelenberg Test", options: ["positive", "negative"] },
    { key: "CO_dizziness", displayName: "C/O Dizziness R/O CNS/ENT causes", options: ["Yes", "No"] },
    { key: "MusculoSkeletal_Movements", displayName: "MusculoSkeletal Movements", options: ["Normal", "Abnormal"] },
    { key: "Claustrophobia", displayName: "Fear in confined/enclosed Space (Claustrophobia)", options: ["Yes", "No"] },
    { key: "Tandem", displayName: "Straight Line (Tandem) Walking", options: ["Normal", "Abnormal"] },
    { key: "Nystagmus_Test", displayName: "Nystagmus Test", options: ["Normal", "Abnormal"] },
    { key: "Dysdiadochokinesia", displayName: "Dysdiadochokinesia", options: ["Normal", "Abnormal"] },
    { key: "Finger_nose_test", displayName: "Finger Nose Test", options: ["Normal", "Abnormal"] },
    { key: "Psychological_PMK", displayName: "Psychological - PMK", options: ["Normal", "Abnormal"] },
    { key: "Psychological_zollingar", displayName: "Psychological - Zollinger", options: ["Normal", "Abnormal"] }
];

const FitnessPage = ({ data, mrdNo, register }) => {
    const [showAllTests, setShowAllTests] = useState(false); // For toggling fitness tests visibility
    const allOptions = ["Height", "Gas Line", "Confined Space", "SCBA Rescuer", "Fire Rescuer", "Lone Worker", "Fisher Man", "Snake Catcher", "Others"];
    const statutoryOptions = ["Select Form", "Form 17", "Form 38", "Form 39", "Form 40", "Form 27"];
    const eyeExamFitStatusOptions = ['Fit', 'Fit when newly prescribed glass', 'Fit with existing glass', 'Fit with an advice to change existing glass with newly prescribed glass', 'Unfit'];

    const initialFitnessFormData = {
        emp_no: data?.[0]?.emp_no || '',
        tremors: "", romberg_test: "", acrophobia: "", trendelenberg_test: "",
        CO_dizziness: "", MusculoSkeletal_Movements: "", Claustrophobia: "",
        Tandem: "", Nystagmus_Test: "", Dysdiadochokinesia: "",
        Finger_nose_test: "", Psychological_PMK: "", Psychological_zollingar: ""
    };

    const initialMedicalCertificateState = {
        employeeName: '', age: '', sex: '', date: '', empNo: '', department: '', jswContract: '',
        natureOfWork: '', covidVaccination: '', diagnosis: '', leaveFrom: '', leaveUpTo: '',
        daysLeave: '', rejoiningDate: '', shift: '', pr: '', sp02: '', temp: '',
        certificateFrom: '', note: '', ohcStaffSignature: '', individualSignature: '',
    };

    const [doctors, setdoctors] = useState([])
    console.log(doctors)
 useEffect(() => {
    const fetchDetails = async () => {
        try {
            const response = await axios.post("http://localhost:8000/adminData");
            const fetchedEmployees = response.data.data;
            console.log(fetchedEmployees)

            const doctorNames = fetchedEmployees
                .filter(emp => emp.role === "doctor")
                .map(emp => emp.name);

            setdoctors(doctorNames);
            setbookedDoctor(doctorNames[0]);

        } catch (error) {
            console.error("Error fetching employee data:", error);
        }
    };

    fetchDetails();
}, []); 

    const [fitnessFormData, setFitnessFormData] = useState(initialFitnessFormData);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [conditionalOptions, setConditionalOptions] = useState([]);
    const [otherJobNature, setOtherJobNature] = useState("");
    const [conditionalotherJobNature, setconditionalOtherJobNature] = useState("");
    const [overallFitness, setOverallFitness] = useState("");
    const [systematicExamination, setSystematicExamination] = useState("");
    const [generalExamination, setGeneralExamination] = useState("");
    const [eyeExamResult, setEyeExamResult] = useState(""); // New state
    const [eyeExamFitStatus, setEyeExamFitStatus] = useState("");
    const [comments, setComments] = useState("");
    const [specialCases, setSpecialCases] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- State for Medical Certificate Tab ---
    const [showMedicalCertificate, setShowMedicalCertificate] = useState(false);
    const [logoSrc, setLogoSrc] = useState('https://via.placeholder.com/150x60.png?text=Company+Logo'); // Placeholder logo
    const [medicalCertificateData, setMedicalCertificateData] = useState(initialMedicalCertificateState);

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

    const accessLevel = localStorage.getItem("accessLevel");
    const isDoctor = accessLevel === 'doctor';

    const parseJsonArray = (jsonString) => {
        if (!jsonString || typeof jsonString !== 'string') return [];
        try {
            const parsed = JSON.parse(jsonString);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error("Error parsing JSON string:", jsonString, error);
            return [];
        }
    };

    const loadOrCreateFormState = useCallback((existingFormData, setter, defaultState, currentEmpNo) => {
        if (existingFormData) {
            const formattedData = { ...existingFormData };
            Object.keys(formattedData).forEach(key => {
                const value = formattedData[key];
                if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?$/)) {
                    formattedData[key] = moment(value).format('YYYY-MM-DD');
                }
            });
            setter({ ...defaultState, ...formattedData, emp_no: currentEmpNo });
        } else {
            setter({ ...defaultState, emp_no: currentEmpNo });
        }
    }, []);

    useEffect(() => {
        const currentEmpNo = data?.[0]?.emp_no || '';
        if (data && data[0]) {
            console.log(data[0].fitnessassessment)
            const assessmentData = data[0].fitnessassessment;
            console.log(assessmentData)
            if (assessmentData) {
                const loadedFitnessData = { emp_no: assessmentData.emp_no || currentEmpNo };
                allFitnessTestsConfig.forEach(test => {
                    loadedFitnessData[test.key] = assessmentData[test.key] || "";
                });
                setFitnessFormData(loadedFitnessData);

                setSelectedOptions(parseJsonArray(assessmentData.job_nature));
                setConditionalOptions(parseJsonArray(assessmentData.conditional_fit_feilds));
                setOverallFitness(assessmentData.overall_fitness || "");
                setComments(assessmentData.comments || "");
                setSystematicExamination(assessmentData.systematic_examination || "");
                setGeneralExamination(assessmentData.general_examination || "");
                setEyeExamResult(assessmentData.eye_exam_result || ""); // Load eye_exam_result
                setEyeExamFitStatus(assessmentData.eye_exam_fit_status || "");
                setSpecialCases(assessmentData.special_cases || "");
                setOtherJobNature(assessmentData.other_job_nature || "");
                setconditionalOtherJobNature(assessmentData.conditional_other_job_nature || "");

                 if (Array.isArray(assessmentData.follow_up_mrd_history)) {
        // The incoming data is an array of objects, e.g., [{mrd: '...'}, {mrd: '...'}]
        // We need to map it to the structure our component expects: [{id: ..., mrd: '...'}]
        const formattedVisits = assessmentData.follow_up_mrd_history.map((visitObject, index) => ({
            id: Date.now() + index, // Create a unique ID for React's key prop
            mrd: visitObject.mrd,      // Extract the MRD string from the object
        }));
        setPreviousVisits(formattedVisits);
    } else {
        setPreviousVisits([]); // Otherwise, initialize as an empty array
    }
            } else {
                setFitnessFormData({ ...initialFitnessFormData, emp_no: currentEmpNo });
                setSelectedOptions([]); setConditionalOptions([]); setOverallFitness(""); setComments("");
                setSystematicExamination(""); setGeneralExamination("");
                setEyeExamResult(""); setEyeExamFitStatus(""); setSpecialCases("");
                setOtherJobNature(""); setconditionalOtherJobNature("");
            }

            // Pre-fill Medical Certificate data
            setMedicalCertificateData({
                ...initialMedicalCertificateState, // Start with a clean slate to avoid carry-over
                employeeName: data[0].name || '',
                age: data[0].dob ? moment().diff(moment(data[0].dob), 'years').toString() : '',
                sex: data[0].gender || '',
                empNo: currentEmpNo,
                department: data[0].department || '',
                natureOfWork: data[0].designation || ''
            });

            loadOrCreateFormState(data[0].form17, setForm17Data, initialForm17State, currentEmpNo);
            loadOrCreateFormState(data[0].form38, setForm38Data, initialForm38State, currentEmpNo);
            loadOrCreateFormState(data[0].form39, setForm39Data, initialForm39State, currentEmpNo);
            loadOrCreateFormState(data[0].form40, setForm40Data, initialForm40State, currentEmpNo);
            loadOrCreateFormState(data[0].form27, setForm27Data, initialForm27State, currentEmpNo);
            setSelectedStatutoryForms([]);
        } else {
            setFitnessFormData({ ...initialFitnessFormData, emp_no: '' });
            setSelectedOptions([]); setConditionalOptions([]); setOverallFitness(""); setComments("");
            setSystematicExamination(""); setGeneralExamination("");
            setEyeExamResult(""); setEyeExamFitStatus(""); setSpecialCases("");
            setOtherJobNature(""); setconditionalOtherJobNature("");
            setMedicalCertificateData(initialMedicalCertificateState);
            const emptyEmpNo = '';
            setForm17Data({ ...initialForm17State, emp_no: emptyEmpNo });
            setForm38Data({ ...initialForm38State, emp_no: emptyEmpNo });
            setForm39Data({ ...initialForm39State, emp_no: emptyEmpNo });
            setForm40Data({ ...initialForm40State, emp_no: emptyEmpNo });
            setForm27Data({ ...initialForm27State, emp_no: emptyEmpNo });
            setSelectedStatutoryForms([]);
        }
    }, [data, loadOrCreateFormState]);

    const handleFitnessInputChange = (e) => { setFitnessFormData({ ...fitnessFormData, [e.target.name]: e.target.value }); };
    const handleSelectChange = (e) => {
        const value = e.target.value;
        if (value && !selectedOptions.includes(value)) setSelectedOptions([...selectedOptions, value]);
        e.target.value = "";
    };
    const handleRemoveSelected = (valueToRemove) => {
        setSelectedOptions(selectedOptions.filter(option => option !== valueToRemove));
        if (valueToRemove === "Others") setOtherJobNature("");
    };
    const handleEyeExamResultChange = (e) => { setEyeExamResult(e.target.value); };
    const handleEyeExamFitStatusChange = (e) => { setEyeExamFitStatus(e.target.value); };
    const handleSystematicChange = (e) => { setSystematicExamination(e.target.value); };
    const handleGeneralExaminationChange = (e) => { setGeneralExamination(e.target.value); };
    const handleOverallFitnessChange = (e) => {
        const newFitness = e.target.value;
        setOverallFitness(newFitness);
        if (newFitness !== "conditional") {
            setConditionalOptions([]);
            setconditionalOtherJobNature("");
        }
    };
    const handleConditionalSelectChange = (e) => {
        const value = e.target.value;
        if (value && !conditionalOptions.includes(value)) setConditionalOptions([...conditionalOptions, value]);
        e.target.value = "";
    };
    const handleRemoveConditionalSelected = (valueToRemove) => {
        setConditionalOptions(conditionalOptions.filter(option => option !== valueToRemove));
        if (valueToRemove === "Others") setconditionalOtherJobNature("");
    };
    const handleCommentsChange = (e) => { setComments(e.target.value); };
    const handleSpecialCasesChange = (e) => { setSpecialCases(e.target.value); };
    const handleStatutorySelectChange = (e) => {
        const formName = e.target.value;
        if (formName && formName !== "Select Form" && !selectedStatutoryForms.includes(formName)) {
            setSelectedStatutoryForms([...selectedStatutoryForms, formName]);
        }
        e.target.value = "Select Form";
    };
    const handleRemoveStatutorySelected = useCallback((formNameToRemove) => {
        setSelectedStatutoryForms(prevForms => prevForms.filter(form => form !== formNameToRemove));
    }, []);

    const handleFormInputChange = (setter, name, value, dobField = 'dob') => {
        setter(prevData => ({
            ...prevData,
            [name]: value,
            ...(name === dobField && value ? { age: moment().diff(moment(value), 'years').toString() } : {})
        }));
    };
    const handleForm17InputChange = (e) => handleFormInputChange(setForm17Data, e.target.name, e.target.value);
    const handleForm38InputChange = (e) => handleFormInputChange(setForm38Data, e.target.name, e.target.value, 'dob'); // Assuming Form 38 might use 'dob' for age
    const handleForm39InputChange = (e) => handleFormInputChange(setForm39Data, e.target.name, e.target.value, 'dob'); // Assuming Form 39 might use 'dob' for age
    const handleForm40InputChange = (e) => handleFormInputChange(setForm40Data, e.target.name, e.target.value, 'dob'); // Assuming Form 40 might use 'dob' for age
    const handleForm27InputChange = (e) => handleFormInputChange(setForm27Data, e.target.name, e.target.value, 'dateOfBirth');

    // --- Handler for Medical Certificate Form ---
    const handleMedicalCertificateChange = (e) => {
        const { name, value } = e.target;
        setMedicalCertificateData(prevData => ({ ...prevData, [name]: value }));
    };

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

    const submitData = async (url, method, payload, successMessage, errorMessagePrefix) => {
        setIsSubmitting(true);
        const csrftoken = getCookie('csrftoken');
        console.log(`Submitting to ${url} with method ${method}`, payload);

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify(payload),
            });
            if (response.ok) {
                const result = await response.json();
                console.log(`${successMessage} Response:`, result);
                alert(successMessage);
                return { success: true, data: result };
            } else {
                const errorData = await response.text();
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
        const [bookedDoctor, setbookedDoctor] =  useState("")

    // --- AFTER (Corrected Code) ---
    const handleFitnessSubmit = async () => {
        const currentEmpNo = data?.[0]?.emp_no;

        if (!mrdNo) {
            alert("Please submit the entries first to get MRD Number");
            return;
        }
        if ((!overallFitness && accessLevel === "doctor")) {
            alert("Please select Overall Fitness status before submitting.");
            return;
        }
        const aadharNo = data?.[0]?.aadhar || '';
        if (!aadharNo) {
            alert("Aadhar number is required.");
            return;
        }
        const existingAssessment = data?.[0]?.fitnessassessment?.fitness_assessment || false;
        const method = existingAssessment ? 'PUT' : 'POST';
        const url = FITNESS_ASSESSMENT_URL;
        const employer = data?.[0]?.type || '';
        const submittedDoctor = localStorage.getItem("userData") || '';

        const payload = {
            ...fitnessFormData,
            mrdNo: mrdNo,
            job_nature: JSON.stringify(selectedOptions),
            submittedDoctor: submittedDoctor,
            conditional_fit_feilds: JSON.stringify(conditionalOptions),
            overall_fitness: overallFitness,
            systematic_examination: systematicExamination,
            general_examination: generalExamination,
            eye_exam_result: eyeExamResult,
            eye_exam_fit_status: eyeExamFitStatus,
            comments: comments,
            aadhar: aadharNo,
            employer: employer,
            special_cases: specialCases,
            emp_no: currentEmpNo,
            other_job_nature: otherJobNature,
            conditional_other_job_nature: conditionalotherJobNature,
            follow_up_mrd_history:previousVisits,
            bookedDoctor: bookedDoctor,
            accessLevel
        };
        await submitData(url, method, payload, "Fitness Assessment submitted successfully!", "Fitness Assessment Submission");
    };

    const submitStatutoryForm = async (baseUrl, formData, formName, setDataState, defaultState, removeFormCallback) => {
        const currentEmpNo = data?.[0]?.emp_no;
        const aadharNo = data?.[0]?.aadhar || '';
        const employer = data?.[0]?.type || '';
        if (!aadharNo) {
            alert(`Cannot submit ${formName}. Aadhar number is missing.`);
            return;
        }
        const method = 'POST';
        const url = baseUrl;
        const payload = { ...formData, aadhar: aadharNo, employer: employer, emp_no: currentEmpNo };
        const result = await submitData(url, method, payload, `${formName} submitted successfully!`, `${formName} Submission`);
        if (result.success && result.data) {
            loadOrCreateFormState(result.data, setDataState, defaultState, currentEmpNo);
        }
    };

    const submitForm17 = () => submitStatutoryForm(FORM17_URL, form17Data, "Form 17", setForm17Data, initialForm17State, handleRemoveStatutorySelected);
    const submitForm38 = () => submitStatutoryForm(FORM38_URL, form38Data, "Form 38", setForm38Data, initialForm38State, handleRemoveStatutorySelected);
    const submitForm39 = () => submitStatutoryForm(FORM39_URL, form39Data, "Form 39", setForm39Data, initialForm39State, handleRemoveStatutorySelected);
    const submitForm40 = () => submitStatutoryForm(FORM40_URL, form40Data, "Form 40", setForm40Data, initialForm40State, handleRemoveStatutorySelected);
    const submitForm27 = () => submitStatutoryForm(FORM27_URL, form27Data, "Form 27", setForm27Data, initialForm27State, handleRemoveStatutorySelected);

    const renderForm17 = () => (
        <div className="border p-4 rounded-md bg-gray-50 shadow-inner">
            <h3 className="text-md font-semibold mb-3 text-gray-600">Form 17 Details</h3>
            <input type="hidden" name="emp_no" value={form17Data.emp_no || data?.[0]?.emp_no || ''} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Fields... (same as primary) */}
                <div><label htmlFor="form17_dept" className={labelClass}>Dept</label><input type="text" id="form17_dept" name="dept" placeholder="Department" className={inputClass} value={form17Data.dept || ''} onChange={handleForm17InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form17_worksNumber" className={labelClass}>Works Number</label><input type="text" id="form17_worksNumber" name="worksNumber" placeholder="Works Number" className={inputClass} value={form17Data.worksNumber || ''} onChange={handleForm17InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form17_workerName" className={labelClass}>Worker Name</label><input type="text" id="form17_workerName" name="workerName" placeholder="Worker Name" className={inputClass} value={form17Data.workerName || data?.[0]?.name || ''} onChange={handleForm17InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form17_sex" className={labelClass}>Sex</label><select id="form17_sex" name="sex" className={selectClass} value={form17Data.sex || data?.[0]?.gender || 'male'} onChange={handleForm17InputChange} disabled={isSubmitting}><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
                <div><label htmlFor="form17_dob" className={labelClass}>Date of Birth</label><input type="date" id="form17_dob" name="dob" className={inputClass} value={form17Data.dob || data?.[0]?.dob || ''} onChange={handleForm17InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form17_age" className={labelClass}>Age</label><input type="text" id="form17_age" name="age" placeholder="Age (auto)" className={`${inputClass} bg-gray-100`} value={form17Data.age || ''} readOnly /></div>
                <div><label htmlFor="form17_employmentDate" className={labelClass}>Employment Date</label><input type="date" id="form17_employmentDate" name="employmentDate" className={inputClass} value={form17Data.employmentDate || ''} onChange={handleForm17InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form17_leavingDate" className={labelClass}>Leaving Date</label><input type="date" id="form17_leavingDate" name="leavingDate" className={inputClass} value={form17Data.leavingDate || ''} onChange={handleForm17InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form17_reason" className={labelClass}>Reason for Leaving</label><input type="text" id="form17_reason" name="reason" placeholder="Reason" className={inputClass} value={form17Data.reason || ''} onChange={handleForm17InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form17_transferredTo" className={labelClass}>Transferred To</label><input type="text" id="form17_transferredTo" name="transferredTo" placeholder="Transfer Location" className={inputClass} value={form17Data.transferredTo || ''} onChange={handleForm17InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form17_jobNature" className={labelClass}>Nature of Job</label><input type="text" id="form17_jobNature" name="jobNature" placeholder="Job Nature" className={inputClass} value={form17Data.jobNature || data?.[0]?.designation || ''} onChange={handleForm17InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form17_rawMaterial" className={labelClass}>Raw Material/Product Handled</label><input type="text" id="form17_rawMaterial" name="rawMaterial" placeholder="Raw Material" className={inputClass} value={form17Data.rawMaterial || ''} onChange={handleForm17InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form17_medicalExamDate" className={labelClass}>Medical Exam Date</label><input type="date" id="form17_medicalExamDate" name="medicalExamDate" className={inputClass} value={form17Data.medicalExamDate || ''} onChange={handleForm17InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form17_medicalExamResult" className={labelClass}>Medical Exam Result</label><input type="text" id="form17_medicalExamResult" name="medicalExamResult" placeholder="Result" className={inputClass} value={form17Data.medicalExamResult || ''} onChange={handleForm17InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form17_suspensionDetails" className={labelClass}>Details of Suspension</label><input type="text" id="form17_suspensionDetails" name="suspensionDetails" placeholder="Suspension Details" className={inputClass} value={form17Data.suspensionDetails || ''} onChange={handleForm17InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form17_recertifiedDate" className={labelClass}>Recertified Date</label><input type="date" id="form17_recertifiedDate" name="recertifiedDate" className={inputClass} value={form17Data.recertifiedDate || ''} onChange={handleForm17InputChange} disabled={isSubmitting} /></div>
                <div className="sm:col-span-2 md:col-span-1"><label htmlFor="form17_unfitnessCertificate" className={labelClass}>Certificate of Unfitness</label><input type="text" id="form17_unfitnessCertificate" name="unfitnessCertificate" placeholder="Unfitness Certificate Details" className={inputClass} value={form17Data.unfitnessCertificate || ''} onChange={handleForm17InputChange} disabled={isSubmitting} /></div>
            </div>
            <div className="mt-4 flex justify-between items-center">
                <button onClick={submitForm17} className={`bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Form 17'}
                </button>
                <button onClick={() => generateFormPdf(form17Data, "Form 17", data?.[0]?.emp_no, data?.[0]?.name, FORM17_LABELS)} className={`bg-yellow-500 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!data?.[0]?.aadhar || isSubmitting}>
                    Generate PDF
                </button>
            </div>
        </div>
    );
    const renderForm38 = () => (
        <div className="border p-4 rounded-md bg-gray-50 shadow-inner">
            <h3 className="text-md font-semibold mb-3 text-gray-600">Form 38 Details</h3>
            <input type="hidden" name="emp_no" value={form38Data.emp_no || data?.[0]?.emp_no || ''} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Fields... (same as primary) */}
                <div><label htmlFor="form38_serialNumber" className={labelClass}>Serial Number</label><input type="text" id="form38_serialNumber" name="serialNumber" placeholder="Serial Number" className={inputClass} value={form38Data.serialNumber || ''} onChange={handleForm38InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form38_department" className={labelClass}>Department/Workers</label><input type="text" id="form38_department" name="department" placeholder="Department" className={inputClass} value={form38Data.department || data?.[0]?.department || ''} onChange={handleForm38InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form38_workerName" className={labelClass}>Name of Worker</label><input type="text" id="form38_workerName" name="workerName" placeholder="Worker Name" className={inputClass} value={form38Data.workerName || data?.[0]?.name || ''} onChange={handleForm38InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form38_sex" className={labelClass}>Sex</label><select id="form38_sex" name="sex" className={selectClass} value={form38Data.sex || data?.[0]?.gender || 'male'} onChange={handleForm38InputChange} disabled={isSubmitting}><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
                <div><label htmlFor="form38_age" className={labelClass}>Age</label><input type="number" id="form38_age" name="age" placeholder="Age" className={inputClass} value={form38Data.age || (data?.[0]?.dob ? moment().diff(moment(data[0].dob), 'years') : '') || ''} onChange={handleForm38InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form38_jobNature" className={labelClass}>Nature of Job</label><input type="text" id="form38_jobNature" name="jobNature" placeholder="Job Nature" className={inputClass} value={form38Data.jobNature || data?.[0]?.designation || ''} onChange={handleForm38InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form38_employmentDate" className={labelClass}>Date of Employment</label><input type="date" id="form38_employmentDate" name="employmentDate" className={inputClass} value={form38Data.employmentDate || ''} onChange={handleForm38InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form38_eyeExamDate" className={labelClass}>Date of Eye Exam</label><input type="date" id="form38_eyeExamDate" name="eyeExamDate" className={inputClass} value={form38Data.eyeExamDate || ''} onChange={handleForm38InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form38_result" className={labelClass}>Result</label><input type="text" id="form38_result" name="result" placeholder="Result" className={inputClass} value={form38Data.result || ''} onChange={handleForm38InputChange} disabled={isSubmitting} /></div>
                <div className="sm:col-span-2 md:col-span-3"><label htmlFor="form38_remarks" className={labelClass}>Remarks</label><textarea id="form38_remarks" name="remarks" placeholder="Enter remarks" rows="2" className={inputClass} value={form38Data.remarks || ''} onChange={handleForm38InputChange} disabled={isSubmitting}></textarea></div>
            </div>
            <div className="mt-4 flex justify-between items-center">
                <button onClick={submitForm38} className={`bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Form 38'}
                </button>
                <button onClick={() => generateFormPdf(form38Data, "Form 38", data?.[0]?.emp_no, data?.[0]?.name, FORM38_LABELS)} className={`bg-yellow-500 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!data?.[0]?.aadhar || isSubmitting}>
                    Generate PDF
                </button>
            </div>
        </div>
    );
    const renderForm39 = () => (
        <div className="border p-4 rounded-md bg-gray-50 shadow-inner">
            <h3 className="text-md font-semibold mb-3 text-gray-600">Form 39 Details</h3>
            <input type="hidden" name="emp_no" value={form39Data.emp_no || data?.[0]?.emp_no || ''} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Fields... (same as primary) */}
                <div><label htmlFor="form39_serialNumber" className={labelClass}>Serial Number</label><input type="text" id="form39_serialNumber" name="serialNumber" placeholder="Serial Number" className={inputClass} value={form39Data.serialNumber || ''} onChange={handleForm39InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form39_workerName" className={labelClass}>Name of Worker</label><input type="text" id="form39_workerName" name="workerName" placeholder="Worker Name" className={inputClass} value={form39Data.workerName || data?.[0]?.name || ''} onChange={handleForm39InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form39_sex" className={labelClass}>Sex</label><select id="form39_sex" name="sex" className={selectClass} value={form39Data.sex || data?.[0]?.gender || 'male'} onChange={handleForm39InputChange} disabled={isSubmitting}><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
                <div><label htmlFor="form39_age" className={labelClass}>Age</label><input type="number" id="form39_age" name="age" placeholder="Age" className={inputClass} value={form39Data.age || (data?.[0]?.dob ? moment().diff(moment(data[0].dob), 'years') : '') || ''} onChange={handleForm39InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form39_proposedEmploymentDate" className={labelClass}>Date of Proposed Employment</label><input type="date" id="form39_proposedEmploymentDate" name="proposedEmploymentDate" className={inputClass} value={form39Data.proposedEmploymentDate || ''} onChange={handleForm39InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form39_jobOccupation" className={labelClass}>Job Occupation</label><input type="text" id="form39_jobOccupation" name="jobOccupation" placeholder="Job Occupation" className={inputClass} value={form39Data.jobOccupation || data?.[0]?.designation || ''} onChange={handleForm39InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form39_rawMaterialHandled" className={labelClass}>Raw Material Handled</label><input type="text" id="form39_rawMaterialHandled" name="rawMaterialHandled" placeholder="Raw Material" className={inputClass} value={form39Data.rawMaterialHandled || ''} onChange={handleForm39InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form39_medicalExamDate" className={labelClass}>Date of Medical Examination</label><input type="date" id="form39_medicalExamDate" name="medicalExamDate" className={inputClass} value={form39Data.medicalExamDate || ''} onChange={handleForm39InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form39_medicalExamResult" className={labelClass}>Result of Medical Examination</label><input type="text" id="form39_medicalExamResult" name="medicalExamResult" placeholder="Result" className={inputClass} value={form39Data.medicalExamResult || ''} onChange={handleForm39InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form39_certifiedFit" className={labelClass}>Certified Fit/Unfit</label><select id="form39_certifiedFit" name="certifiedFit" className={selectClass} value={form39Data.certifiedFit || ''} onChange={handleForm39InputChange} disabled={isSubmitting}><option value="" disabled>Select Status</option><option value="fit">Fit</option><option value="unfit">Unfit</option><option value="conditional">Conditional</option></select></div>
                <div className="sm:col-span-2 md:col-span-1"><label htmlFor="form39_departmentSection" className={labelClass}>Department/Section/Works No.</label><input type="text" id="form39_departmentSection" name="departmentSection" placeholder="Dept/Section" className={inputClass} value={form39Data.departmentSection || data?.[0]?.department || ''} onChange={handleForm39InputChange} disabled={isSubmitting} /></div>
            </div>
            <div className="mt-4 flex justify-between items-center">
                <button onClick={submitForm39} className={`bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Form 39'}
                </button>
                <button onClick={() => generateFormPdf(form39Data, "Form 39", data?.[0]?.emp_no, data?.[0]?.name, FORM39_LABELS)} className={`bg-yellow-500 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!data?.[0]?.aadhar || isSubmitting}>
                    Generate PDF
                </button>
            </div>
        </div>
    );
    const renderForm40 = () => (
        <div className="border p-4 rounded-md bg-gray-50 shadow-inner">
            <h3 className="text-md font-semibold mb-3 text-gray-600">Form 40 Details</h3>
            <input type="hidden" name="emp_no" value={form40Data.emp_no || data?.[0]?.emp_no || ''} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Fields... (same as primary) */}
                <div><label htmlFor="form40_serialNumber" className={labelClass}>Serial Number</label><input type="text" id="form40_serialNumber" name="serialNumber" placeholder="Serial Number" className={inputClass} value={form40Data.serialNumber || ''} onChange={handleForm40InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form40_dateOfEmployment" className={labelClass}>Date of Employment</label><input type="date" id="form40_dateOfEmployment" name="dateOfEmployment" className={inputClass} value={form40Data.dateOfEmployment || ''} onChange={handleForm40InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form40_workerName" className={labelClass}>Name of Worker</label><input type="text" id="form40_workerName" name="workerName" placeholder="Worker Name" className={inputClass} value={form40Data.workerName || data?.[0]?.name || ''} onChange={handleForm40InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form40_sex" className={labelClass}>Sex</label><select id="form40_sex" name="sex" className={selectClass} value={form40Data.sex || data?.[0]?.gender || 'male'} onChange={handleForm40InputChange} disabled={isSubmitting}><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
                <div><label htmlFor="form40_age" className={labelClass}>Age</label><input type="number" id="form40_age" name="age" placeholder="Age" className={inputClass} value={form40Data.age || (data?.[0]?.dob ? moment().diff(moment(data[0].dob), 'years') : '') || ''} onChange={handleForm40InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form40_sonWifeDaughterOf" className={labelClass}>Son/Wife/Daughter Of</label><input type="text" id="form40_sonWifeDaughterOf" name="sonWifeDaughterOf" placeholder="Parent/Spouse Name" className={inputClass} value={form40Data.sonWifeDaughterOf || ''} onChange={handleForm40InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form40_natureOfJob" className={labelClass}>Nature of Job</label><input type="text" id="form40_natureOfJob" name="natureOfJob" placeholder="Job Nature" className={inputClass} value={form40Data.natureOfJob || data?.[0]?.designation || ''} onChange={handleForm40InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form40_urineResult" className={labelClass}>Urine Result</label><input type="text" id="form40_urineResult" name="urineResult" placeholder="Urine Result" className={inputClass} value={form40Data.urineResult || ''} onChange={handleForm40InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form40_bloodResult" className={labelClass}>Blood Result</label><input type="text" id="form40_bloodResult" name="bloodResult" placeholder="Blood Result" className={inputClass} value={form40Data.bloodResult || ''} onChange={handleForm40InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form40_fecesResult" className={labelClass}>Feces Result</label><input type="text" id="form40_fecesResult" name="fecesResult" placeholder="Feces Result" className={inputClass} value={form40Data.fecesResult || ''} onChange={handleForm40InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form40_xrayResult" className={labelClass}>X-Ray Result</label><input type="text" id="form40_xrayResult" name="xrayResult" placeholder="X-Ray Result" className={inputClass} value={form40Data.xrayResult || ''} onChange={handleForm40InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form40_otherExamResult" className={labelClass}>Other Examination Result</label><input type="text" id="form40_otherExamResult" name="otherExamResult" placeholder="Other Result" className={inputClass} value={form40Data.otherExamResult || ''} onChange={handleForm40InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form40_deworming" className={labelClass}>Deworming Details</label><input type="text" id="form40_deworming" name="deworming" placeholder="Deworming" className={inputClass} value={form40Data.deworming || ''} onChange={handleForm40InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form40_typhoidVaccinationDate" className={labelClass}>Typhoid Vaccination Date</label><input type="date" id="form40_typhoidVaccinationDate" name="typhoidVaccinationDate" className={inputClass} value={form40Data.typhoidVaccinationDate || ''} onChange={handleForm40InputChange} disabled={isSubmitting} /></div>
                <div className="sm:col-span-2"><label htmlFor="form40_remarks" className={labelClass}>Remarks</label><input type="text" id="form40_remarks" name="remarks" placeholder="Remarks" className={inputClass} value={form40Data.remarks || ''} onChange={handleForm40InputChange} disabled={isSubmitting} /></div>
            </div>
            <div className="mt-4 flex justify-between items-center">
                <button onClick={submitForm40} className={`bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Form 40'}
                </button>
                <button onClick={() => generateFormPdf(form40Data, "Form 40", data?.[0]?.emp_no, data?.[0]?.name, FORM40_LABELS)} className={`bg-yellow-500 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!data?.[0]?.aadhar || isSubmitting}>
                    Generate PDF
                </button>
            </div>
        </div>
    );
    const renderForm27 = () => (
        <div className="border p-4 rounded-md bg-gray-50 shadow-inner">
            <h3 className="text-md font-semibold mb-3 text-gray-600">Form 27 Details</h3>
            <input type="hidden" name="emp_no" value={form27Data.emp_no || data?.[0]?.emp_no || ''} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Fields... (same as primary) */}
                <div><label htmlFor="form27_serialNumber" className={labelClass}>Serial Number</label><input type="text" id="form27_serialNumber" name="serialNumber" placeholder="Serial Number" className={inputClass} value={form27Data.serialNumber || ''} onChange={handleForm27InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form27_date" className={labelClass}>Date</label><input type="date" id="form27_date" name="date" className={inputClass} value={form27Data.date || ''} onChange={handleForm27InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form27_department" className={labelClass}>Department</label><input type="text" id="form27_department" name="department" placeholder="Department" className={inputClass} value={form27Data.department || data?.[0]?.department || ''} onChange={handleForm27InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form27_nameOfWorks" className={labelClass}>Name of Works</label><input type="text" id="form27_nameOfWorks" name="nameOfWorks" placeholder="Name of Works" className={inputClass} value={form27Data.nameOfWorks || ''} onChange={handleForm27InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form27_sex" className={labelClass}>Sex</label><select id="form27_sex" name="sex" className={selectClass} value={form27Data.sex || data?.[0]?.gender || 'male'} onChange={handleForm27InputChange} disabled={isSubmitting}><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
                <div><label htmlFor="form27_age" className={labelClass}>Age</label><input type="number" id="form27_age" name="age" placeholder="Age" className={inputClass} value={form27Data.age || (data?.[0]?.dob ? moment().diff(moment(data[0].dob), 'years') : '') || ''} onChange={handleForm27InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form27_dateOfBirth" className={labelClass}>Date of Birth</label><input type="date" id="form27_dateOfBirth" name="dateOfBirth" className={inputClass} value={form27Data.dateOfBirth || data?.[0]?.dob || ''} onChange={handleForm27InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form27_nameOfTheFather" className={labelClass}>Father's Name</label><input type="text" id="form27_nameOfTheFather" name="nameOfTheFather" placeholder="Father's Name" className={inputClass} value={form27Data.nameOfTheFather || ''} onChange={handleForm27InputChange} disabled={isSubmitting} /></div>
                <div><label htmlFor="form27_natureOfJobOrOccupation" className={labelClass}>Nature of Job/Occupation</label><input type="text" id="form27_natureOfJobOrOccupation" name="natureOfJobOrOccupation" placeholder="Job/Occupation" className={inputClass} value={form27Data.natureOfJobOrOccupation || data?.[0]?.designation || ''} onChange={handleForm27InputChange} disabled={isSubmitting} /></div>
                <div className="sm:col-span-2 md:col-span-1"><label htmlFor="form27_descriptiveMarks" className={labelClass}>Descriptive Marks</label><input type="text" id="form27_descriptiveMarks" name="descriptiveMarks" placeholder="Descriptive Marks" className={inputClass} value={form27Data.descriptiveMarks || ''} onChange={handleForm27InputChange} disabled={isSubmitting} /></div>
            </div>
            <div className="mt-4 flex justify-between items-center">
                <button onClick={submitForm27} className={`bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Form 27'}
                </button>
                <button onClick={() => generateFormPdf(form27Data, "Form 27", data?.[0]?.emp_no, data?.[0]?.name, FORM27_LABELS)} className={`bg-yellow-500 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!data?.[0]?.aadhar || isSubmitting}>
                    Generate PDF
                </button>
            </div>
        </div>
    );

    

    const [previousVisits, setPreviousVisits] = useState([]);
    console.log(previousVisits)
    const handleAddPreviousVisit = () => {
    setPreviousVisits(prev => [...prev, { id: Date.now(), mrd: '' }]);
  };

  const handleRemovePreviousVisit = (id) => {
    setPreviousVisits(prev => prev.filter(visit => visit.id !== id));
  };

  const handlePreviousVisitChange = (id, value) => {
    setPreviousVisits(prev =>
      prev.map(visit => (visit.id === id ? { ...visit, mrd: value } : visit))
    );
  };

    const toggleTests = () => { setShowAllTests(!showAllTests); };
    const toggleMedicalCertificate = () => setShowMedicalCertificate(!showMedicalCertificate);

    return (
        <div>
            
             {(!data || data.length === 0) && (
            <p className="text-center text-red-600 my-4">Please select an employee first to view Fitness categories.</p>
        )}
        {data &&(data.length > 0) && (
        <div className="bg-gray-50 min-h-screen p-4 md:p-6 relative">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-800 border-b pb-2">Fitness Assessment</h1>

            { register === "Fitness After Medical Leave" && (
                <MedicalCertificateForm 
                    mrdNo={mrdNo} 
                    aadhar={data?.[0]?.aadhar}
                    isDoctor={isDoctor} // Good to add this here too
                />
              )}

        { register === "Fitness After Personal Long Leave" && (
            <PersonalLeaveCertificateForm
                mrdNo={mrdNo}
                aadhar={data?.[0]?.aadhar}
                isDoctor={isDoctor} 
            />
        )}

        { register === "Follow Up Visits" && (
    <div className="mt-6 mb-8 p-4 border rounded-lg bg-white shadow-sm">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Previous Visit References</h2>
            <button
                type="button"
                onClick={handleAddPreviousVisit}
                disabled={isSubmitting}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
                + Add Previous Visit
            </button>
        </div>
        <div className="space-y-3">
            {previousVisits.map((visit, index) => (
                <div key={visit.id} className="flex items-center gap-4 p-2 bg-gray-50 rounded-md">
                    <label htmlFor={`prev_mrd_${visit.id}`} className="font-medium text-gray-700">
                       Ref ({index + 1}):
                    </label>
                    <input
                        id={`prev_mrd_${visit.id}`}
                        type="text"
                        placeholder="Enter previous MRD number"
                        className={inputClasses}
                        // ================== FIX IS HERE ==================
                        value={visit.mrd} // Changed from visit.mrd.mrd to visit.mrd
                        // ===============================================
                        onChange={(e) => handlePreviousVisitChange(visit.id, e.target.value)}
                        disabled={isSubmitting}
                    />
                    <button
                        type="button"
                        onClick={() => handleRemovePreviousVisit(visit.id)}
                        disabled={isSubmitting}
                        className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 disabled:bg-gray-400"
                    >
                        Remove
                    </button>
                </div>
            ))}
            {previousVisits.length === 0 && (
                <p className="text-center text-gray-500 p-3">No previous visit references added. Click the button to add one.</p>
            )}
        </div>
    </div>
)}

            <div className="mb-6">
                <button
                    onClick={toggleTests}
                    className="bg-blue-500 mt-10 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 text-sm"
                >
                    {showAllTests ? 'Hide All Tests' : 'Show All Tests'}
                </button>
            </div>

            {showAllTests && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                    {allFitnessTestsConfig.map((test) => (
                        <div key={test.key} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                            <h2 className="text-base md:text-lg font-semibold mb-3 text-gray-700">{test.displayName}</h2>
                            <div className="space-y-2">
                                {test.options.map((value) => (
                                    <label key={value} className="flex items-center space-x-3 cursor-pointer text-gray-600 hover:text-gray-900 text-sm">
                                        <input
                                            type="radio" name={test.key} value={value}
                                            className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                            checked={fitnessFormData[test.key] === value}
                                            onChange={handleFitnessInputChange}
                                            disabled={!data?.[0]?.aadhar || isSubmitting}
                                        />
                                        <span className="capitalize">{value}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Eye Examination Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">

                <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                    <label htmlFor="eyeExamFitStatus" className="block text-base md:text-lg font-semibold mb-3 text-gray-700">Eye Exam Fitness Status by OPHTHALMOLOGIST</label>
                    <select id="eyeExamFitStatus" name="eyeExamFitStatus" value={eyeExamFitStatus} onChange={handleEyeExamFitStatusChange}
                        disabled={!data?.[0]?.aadhar || isSubmitting}
                        className={selectClass + ` ${!data?.[0]?.aadhar || isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        title={!data?.[0]?.emp_no ? "Select an employee first" : ""}>
                        <option value="">-- Select Status --</option>
                        {eyeExamFitStatusOptions.map(option => (<option key={option} value={option}>{option}</option>))}
                    </select>
                </div>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-lg shadow border border-gray-200 mb-6 md:mb-8">
                <div className="mb-6">
                    <h2 className="text-base md:text-lg font-semibold mb-2 text-gray-700">Fitness applied for (Job nature)</h2>
                    <select
                        className={selectClass + ` mb-3 ${!data?.[0]?.aadhar || isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        onChange={handleSelectChange} value=""
                        disabled={!data?.[0]?.aadhar || isSubmitting}
                        title={!data?.[0]?.emp_no ? "Select an employee first" : "Select job nature"}>
                        <option value="" disabled>-- Select an option to add --</option>
                        {allOptions.map((option, index) => (<option key={index} value={option} disabled={selectedOptions.includes(option)}>{option}</option>))}
                    </select>
                    <div className="flex flex-wrap gap-2 min-h-[30px]">
                        {selectedOptions.length > 0 ? (
                            selectedOptions.map((option, index) => (
                                <div key={index} className="flex items-center pl-3 pr-2 py-1 border border-blue-300 rounded-full bg-blue-50 text-xs md:text-sm text-blue-800 shadow-sm">
                                    <span>{option}</span>
                                    <button type="button" className={`ml-2 text-red-500 hover:text-red-700 font-bold text-xs ${isSubmitting ? 'cursor-not-allowed' : ''}`} onClick={() => !isSubmitting && handleRemoveSelected(option)} title={`Remove ${option}`} disabled={isSubmitting}>×</button>
                                </div>
                            ))
                        ) : (<p className="text-sm text-gray-500 italic w-full">No specific job nature selected.</p>)}
                    </div>
                    {selectedOptions.includes("Others") && (
                        <div className="mt-4">
                            <label htmlFor="otherJobNature" className={labelClass}>Specify Other Job Nature:</label>
                            <input type="text" id="otherJobNature" name="otherJobNature" value={otherJobNature} onChange={(e) => { setOtherJobNature(e.target.value) }} disabled={isSubmitting} className={inputClass} placeholder="Enter details for 'Others'" />
                        </div>
                    )}
                </div>

                <div className="mt-6 mb-6">
                    <label htmlFor="generalExamination" className={labelClass}>General Examination</label>
                    <textarea id="generalExamination" name="generalExamination" rows="3" value={generalExamination} onChange={handleGeneralExaminationChange} disabled={!data?.[0]?.aadhar || isSubmitting} className={inputClass + ` ${!data?.[0]?.aadhar || isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`} title={!data?.[0]?.emp_no ? "Select an employee first" : "Add General Examination details"} placeholder="Enter General Examination details here" />
                </div>
                <div className="mt-6 mb-6">
                    <label htmlFor="systematicExamination" className={labelClass}>Systemic Examination</label>
                    <textarea id="systematicExamination" name="systematicExamination" rows="3" value={systematicExamination} onChange={handleSystematicChange} disabled={!data?.[0]?.aadhar || isSubmitting || accessLevel != "doctor"} className={inputClass + ` ${!data?.[0]?.aadhar || isSubmitting || accessLevel != "doctor" ? 'bg-gray-100 cursor-not-allowed' : ''}`} title={!data?.[0]?.emp_no ? "Select an employee first" : "Add Systematic Examination details (CVS, RS, GIT, CNS, etc)"} placeholder="Enter Systematic Examination details (CVS, RS, GIT, CNS, etc)" />
                </div>
            {accessLevel === "nurse" &&(   <div>
                    <div>
                        <label htmlFor="">Book this footfall to:</label>
                        <select className="px-4 py-2 w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" name="" id="" value={bookedDoctor} onChange={(e)=>{setbookedDoctor(e.target.value)}}>
                            {doctors.map((doc,key) =>(
                                <option key={key} value ={doc}>{doc}</option>
                            ))}
                        </select>
                    </div>
                </div>)}

                {accessLevel === "doctor" && (
                    <div className="border-t pt-6 mt-6 space-y-6">
                        <div>
                            <label className={labelClass}>Fit for (Job Nature)</label>
                            <select value={overallFitness} onChange={handleOverallFitnessChange} disabled={!data?.[0]?.aadhar || isSubmitting} className={selectClass + ` ${!data?.[0]?.aadhar || isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`} title={!data?.[0]?.emp_no ? "Select an employee first" : "Set overall fitness"}>
                                <option value="" disabled>-- Select status --</option>
                                <option value="fit">Fit</option>
                                <option value="unfit">Unfit</option>
                                <option value="conditional">Conditional Fit</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                        {overallFitness === "conditional" && (
                            <div className="pl-4 border-l-4 border-blue-300 py-3 bg-blue-50 rounded-r-md space-y-3">
                                <h3 className="text-md font-semibold text-gray-700">Conditionally Fit For (Select applicable)</h3>
                                <select value="" onChange={handleConditionalSelectChange} disabled={!data?.[0]?.aadhar || isSubmitting} className={selectClass}>
                                    <option value="" disabled>-- Select an option to add --</option>
                                    <option value="Ground Work">Ground Work</option>
                                    {allOptions.map((option, index) => (<option key={index} value={option} disabled={conditionalOptions.includes(option)}>{option}</option>))}
                                </select>
                                <div className="flex flex-wrap gap-2 min-h-[30px]">
                                    {conditionalOptions.length > 0 ? (
                                        conditionalOptions.map((option, index) => (
                                            <div key={index} className="flex items-center pl-3 pr-2 py-1 border border-green-300 rounded-full bg-green-50 text-xs md:text-sm text-green-800 shadow-sm">
                                                <span>{option}</span>
                                                <button type="button" className={`ml-2 text-red-500 hover:text-red-700 font-bold text-xs ${isSubmitting ? 'cursor-not-allowed' : ''}`} onClick={() => !isSubmitting && handleRemoveConditionalSelected(option)} title={`Remove ${option}`} disabled={isSubmitting}>×</button>
                                            </div>
                                        ))
                                    ) : (<p className="text-sm text-gray-500 italic w-full">Specify conditions.</p>)}
                                </div>
                                {conditionalOptions.includes("Others") && (
                                    <div className="mt-4">
                                        <label htmlFor="conditionalotherJobNature" className={labelClass}>Specify Other Conditional Job Nature:</label>
                                        <input type="text" id="conditionalotherJobNature" name="conditionalotherJobNature" value={conditionalotherJobNature} onChange={(e) => { setconditionalOtherJobNature(e.target.value) }} disabled={isSubmitting} className={inputClass} placeholder="Enter details for 'Others'" />
                                    </div>
                                )}
                            </div>
                        )}
                        <div>
                            <label htmlFor="comments" className={labelClass}>Doctor's Remarks / Comments</label>
                            <textarea id="comments" rows="3" value={comments} onChange={handleCommentsChange} disabled={!data?.[0]?.aadhar || isSubmitting} className={inputClass + ` ${!data?.[0]?.aadhar || isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`} title={!data?.[0]?.emp_no ? "Select an employee first" : "Add comments"} placeholder="Enter any relevant comments..." />
                        </div>
                        <div className="mt-4">
                            <label className={labelClass}>Special Cases</label>
                            <div className="flex space-x-4 mt-2">
                                {["Yes", "No", "N/A"].map((value) => (
                                    <label key={value} className="flex items-center space-x-2 cursor-pointer text-gray-600 hover:text-gray-900 text-sm">
                                        <input type="radio" name="specialCases" value={value} className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" checked={specialCases === value} onChange={handleSpecialCasesChange} disabled={!data?.[0]?.aadhar || isSubmitting} title={!data?.[0]?.emp_no ? "Select an employee first" : ""} />
                                        <span>{value}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                )}
                <div className="w-full flex justify-end mt-6 border-t pt-6">
                    <button
                        className={`bg-blue-600 text-white px-5 py-2 md:px-6 md:py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 font-medium text-sm md:text-base ${!data?.[0]?.aadhar || isSubmitting || (!overallFitness && accessLevel === "doctor") ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleFitnessSubmit}
                        disabled={!data?.[0]?.aadhar || isSubmitting || (!overallFitness && accessLevel === "doctor")}
                        title={!data?.[0]?.aadhar ? "Cannot submit without employee data" : ((!overallFitness && accessLevel === "doctor") ? "Overall fitness status is required" : "Submit fitness assessment")}>
                        {isSubmitting ? 'Submitting...' : 'Submit Fitness Assessment'}
                    </button>
                </div>
            </div>

            {accessLevel === "doctor" && (
                <>
                    <h1 className="text-2xl md:text-3xl font-bold my-6 md:my-8 text-gray-800 border-b pb-2">Statutory Forms</h1>
                    <div className="bg-white p-4 md:p-6 rounded-lg shadow border border-gray-200 mb-6 md:mb-8">
                        <h2 className="text-base md:text-lg font-semibold mb-4 text-gray-700">Select Forms to Fill / Generate PDF</h2>
                        <select value="Select Form" onChange={handleStatutorySelectChange} disabled={!data?.[0]?.aadhar || isSubmitting} className={selectClass + ` mb-4 ${!data?.[0]?.aadhar || isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`} title={!data?.[0]?.emp_no ? "Select an employee first" : "Select a form"}>
                            {statutoryOptions.map((option, index) => (<option key={index} value={option} disabled={option === "Select Form" || selectedStatutoryForms.includes(option)}>{option}</option>))}
                        </select>
                        <div className="flex flex-wrap gap-2 mt-4 mb-6 border-t pt-4 min-h-[30px]">
                            {selectedStatutoryForms.length > 0 ? (
                                selectedStatutoryForms.map((option, index) => (
                                    <div key={index} className="flex items-center pl-3 pr-2 py-1 border border-gray-300 rounded-full bg-gray-100 text-xs md:text-sm text-gray-800 shadow-sm">
                                        <span>{option}</span>
                                        <button type="button" className={`ml-2 text-red-500 hover:text-red-700 font-bold text-xs ${isSubmitting ? 'cursor-not-allowed' : ''}`} onClick={() => !isSubmitting && handleRemoveStatutorySelected(option)} title={`Remove ${option}`} disabled={isSubmitting}>×</button>
                                    </div>
                                ))
                            ) : (<p className="text-sm text-gray-500 italic w-full">No statutory forms selected to display/fill.</p>)}
                        </div>
                        {Array.isArray(selectedStatutoryForms) && selectedStatutoryForms.length > 0 && (
                            <div className="flex flex-col space-y-6 mt-4">
                                {selectedStatutoryForms.includes("Form 17") && renderForm17()}
                                {selectedStatutoryForms.includes("Form 38") && renderForm38()}
                                {selectedStatutoryForms.includes("Form 39") && renderForm39()}
                                {selectedStatutoryForms.includes("Form 40") && renderForm40()}
                                {selectedStatutoryForms.includes("Form 27") && renderForm27()}
                            </div>
                        )}
                    </div>
                    {data && data[0] && <SignificantNotes data={data} />}
                </>
            )}
        </div>
        )}
     </div>
    );
};

export default FitnessPage;