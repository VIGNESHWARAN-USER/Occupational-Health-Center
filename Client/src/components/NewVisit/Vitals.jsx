import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaFileUpload, FaInfoCircle } from 'react-icons/fa';

// --- Generic Info Modal Component (Keep as is from Primary) ---
const InfoModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold" aria-label="Close modal">×</button>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
                <div className="text-sm text-gray-600 space-y-2">
                    {children}
                </div>
                <div className="mt-5 text-right">
                    <button onClick={onClose} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Close</button>
                </div>
            </div>
        </div>
    );
};

// --- BMI Standards Modal Component (Keep Updated Ranges from Primary) ---
const BmiStandardsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    const standards = [
        { range: "< 18.5", classification: "Underweight" },
        { range: "18.5 – 24.9", classification: "Normal weight" },
        { range: "25.0 – 29.9", classification: "Overweight" },
        { range: "30.0 – 39.9", classification: "Obesity" },
        { range: "≥ 40.0", classification: "Severe Obesity" },
    ];
    return ( <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" onClick={onClose} > <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative" onClick={(e) => e.stopPropagation()} > <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold" aria-label="Close modal" > × </button> <h3 className="text-lg font-semibold mb-4 text-gray-800">BMI Classification Standards</h3> <table className="w-full text-sm text-left text-gray-600"> <thead className="text-xs text-gray-700 uppercase bg-gray-100 rounded-t-lg"> <tr> <th scope="col" className="px-4 py-2">BMI Range (kg/m²)</th> <th scope="col" className="px-4 py-2">Classification</th> </tr> </thead> <tbody> {standards.map((standard, index) => ( <tr key={index} className="bg-white border-b border-gray-100 last:border-b-0"> <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">{standard.range}</td> <td className="px-4 py-2">{standard.classification}</td> </tr> ))} </tbody> </table> <div className="mt-5 text-right"> <button onClick={onClose} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" > Close </button> </div> </div> </div> );
};

// --- BP Standards Modal Component (Keep as is from Primary) ---
const BpStandardsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    const standards = [ { range: "< 90 / < 60", classification: "Low BP (Hypotension)" }, { range: "< 120 / < 80", classification: "Normal" }, { range: "120-139 / 80-89", classification: "High Normal (Prehypertension)" }, { range: "140-159 / 90-99", classification: "Stage 1 Hypertension" }, { range: "≥ 160 / ≥ 100", classification: "Stage 2 Hypertension" }, { range: "> 180 / > 120", classification: "Hypertensive Urgency/Crisis" }, ];
    return ( <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" onClick={onClose} > <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative" onClick={(e) => e.stopPropagation()} > <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold" aria-label="Close modal" > × </button> <h3 className="text-lg font-semibold mb-4 text-gray-800">Blood Pressure Classification</h3> <p className="text-xs text-gray-500 mb-3">Based on Systolic (Sys) / Diastolic (Dia) mmHg. Higher category applies if Sys/Dia fall into different categories.</p> <table className="w-full text-sm text-left text-gray-600"> <thead className="text-xs text-gray-700 uppercase bg-gray-100"> <tr> <th scope="col" className="px-4 py-2">Range (mmHg)</th> <th scope="col" className="px-4 py-2">Classification</th> </tr> </thead> <tbody> {standards.map((standard, index) => ( <tr key={index} className="bg-white border-b border-gray-100 last:border-b-0"> <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">{standard.range}</td> <td className="px-4 py-2">{standard.classification}</td> </tr> ))} </tbody> </table> <div className="mt-5 text-right"> <button onClick={onClose} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" > Close </button> </div> </div> </div> );
};


// --- Main Vitals Form Component (Integrated) ---
const VitalsForm = ({ data, type }) => {
    const initialData = data?.[0] || {};

    // State includes status fields, matching the Django model
    const [formData, setFormData] = useState({
        systolic: '', diastolic: '', bp_status: '',
        pulse: '', pulse_status: '', pulse_comment: '',
        respiratory_rate: '', respiratory_rate_status: '', respiratory_rate_comment: '',
        temperature: '', temperature_status: '', temperature_comment: '',
        spO2: '', spO2_status: '', spO2_comment: '',
        weight: '', height: '',
        bmi: '', bmi_status: '', bmi_comment: '',
        aadhar: initialData.aadhar || '',
    });

    // State for selected files, using frontend-friendly keys
    const [selectedFiles, setSelectedFiles] = useState({
        SelfDeclaration: null, // Maps to 'self_declared'
        FCExternal: null,      // Maps to 'fc'
        Reports: null,         // Maps to 'report'
        ManualForms: null,     // Maps to 'manual'
    });

    console.log("Current formData state:", formData);

    // Modal States
    const [isBpModalOpen, setIsBpModalOpen] = useState(false);
    const [isPulseModalOpen, setIsPulseModalOpen] = useState(false);
    const [isTempModalOpen, setIsTempModalOpen] = useState(false);
    const [isSpo2ModalOpen, setIsSpo2ModalOpen] = useState(false);
    const [isRespRateModalOpen, setIsRespRateModalOpen] = useState(false);
    const [isBmiModalOpen, setIsBmiModalOpen] = useState(false);

    // --- Calculation Functions ---
    const calculateBmiStatus = (bmiString) => {
        if (bmiString === null || bmiString === undefined || String(bmiString).trim() === '') { return ''; }
        const bmiValue = parseFloat(bmiString);
        if (isNaN(bmiValue)) { return ''; }
        if (bmiValue < 18.5) return 'Underweight';
        if (bmiValue >= 18.5 && bmiValue <= 24.9) return 'Normal weight';
        if (bmiValue >= 25.0 && bmiValue <= 29.9) return 'Overweight';
        if (bmiValue >= 30.0 && bmiValue <= 39.9) return 'Obesity';
        if (bmiValue >= 40.0) return 'Severe Obesity';
        return '';
     };
    const calculateBpStatus = (sysStr, diaStr) => {
        const sys = parseInt(sysStr, 10); const dia = parseInt(diaStr, 10); if (isNaN(sys) || isNaN(dia) || sys <= 0 || dia <= 0) { return ''; } if (sys > 180 || dia > 120) return 'Hypertensive Urgency/Crisis'; if (sys >= 160 || dia >= 100) return 'Stage 2 Hypertension'; if ((sys >= 140 && sys <= 159) || (dia >= 90 && dia <= 99)) return 'Stage 1 Hypertension'; if ((sys >= 120 && sys <= 139) || (dia >= 80 && dia <= 89)) return 'High Normal (Prehypertension)'; if (sys < 120 && dia < 80) return 'Normal'; if (sys < 90 || dia < 60) return 'Low BP (Hypotension)'; return 'Check Values';
     };
    const calculateBmiValue = (heightStr, weightStr) => {
        const heightCm = parseFloat(heightStr); const weightKg = parseFloat(weightStr); if (isNaN(heightCm) || isNaN(weightKg) || heightCm <= 0 || weightKg <= 0) { return ''; } const heightM = heightCm / 100; const bmi = weightKg / (heightM * heightM); return bmi.toFixed(1);
     };
    const calculatePulseStatus = (pulseStr) => {
        const pulse = parseInt(pulseStr, 10); if (isNaN(pulse) || pulse <= 0) return ''; if (pulse < 60) return 'Bradycardia'; if (pulse > 100) return 'Tachycardia'; if (pulse >= 60 && pulse <= 100) return 'Normal'; return 'Check Value';
    };
    const calculateTemperatureStatus = (tempStr) => {
        const tempF = parseFloat(tempStr);
        if (isNaN(tempF)) return '';
        if (tempF < 99.1) return 'Normal';
        if (tempF >= 99.1 && tempF <= 100.4) return 'Low Grade Fever';
        if (tempF >= 100.5 && tempF <= 102.2) return 'Moderate Grade Fever';
        if (tempF >= 102.3 && tempF <= 105.8) return 'High Grade Fever';
        if (tempF > 105.8) return 'Hyperthermic';
        return 'Check Value';
    };
    const calculateSpo2Status = (spo2Str) => {
        const spo2 = parseInt(spo2Str, 10);
        if (isNaN(spo2) || spo2 < 0 || spo2 > 100) return '';
        if (spo2 < 86) return 'Severe Hypoxemia';
        if (spo2 >= 86 && spo2 <= 90) return 'Moderate Hypoxemia';
        if (spo2 >= 91 && spo2 <= 94) return 'Mild Hypoxemia';
        if (spo2 >= 95 && spo2 <= 100) return 'Normal';
        return 'Check Value';
    };
    const calculateRespRateStatus = (respRateStr) => {
        const rate = parseInt(respRateStr, 10); if (isNaN(rate) || rate <= 0) return ''; if (rate < 12) return 'Bradypnea'; if (rate > 20) return 'Tachypnea'; if (rate >= 12 && rate <= 20) return 'Normal'; return 'Check Value';
    };


    // --- Load Initial Data ---
     useEffect(() => {
        const initialVitals = initialData?.vitals; // Assuming vitals are nested under 'vitals' in props `data`
        const defaultState = {
            systolic: '', diastolic: '', bp_status: '',
            pulse: '', pulse_status: '', pulse_comment: '',
            respiratory_rate: '', respiratory_rate_status: '', respiratory_rate_comment: '',
            temperature: '', temperature_status: '', temperature_comment: '',
            spO2: '', spO2_status: '', spO2_comment: '',
            weight: '', height: '',
            bmi: '', bmi_status: '', bmi_comment: '',
            aadhar: initialData.aadhar || '',
        };
        // Reset selected files on data load/change
        setSelectedFiles({ SelfDeclaration: null, FCExternal: null, Reports: null, ManualForms: null });

        if (initialVitals && typeof initialVitals === 'object') {
            console.log("Loading vitals from props:", initialVitals);
            const loadedData = { ...defaultState };
            // Populate form data from initialVitals (including status fields)
            for (const key in defaultState) {
                if (key in initialVitals && initialVitals[key] !== null && initialVitals[key] !== undefined) {
                    loadedData[key] = initialVitals[key];
                }
            }
            // Ensure Aadhar is correctly set from the top-level initialData if needed
            loadedData.aadhar = initialData.aadhar || loadedData.aadhar || '';

            // Recalculate statuses based on loaded values to ensure UI consistency
            // Overwrites potentially stale statuses from DB if values changed elsewhere
            loadedData.bp_status = calculateBpStatus(loadedData.systolic, loadedData.diastolic);
            loadedData.pulse_status = calculatePulseStatus(loadedData.pulse);
            loadedData.temperature_status = calculateTemperatureStatus(loadedData.temperature);
            loadedData.spO2_status = calculateSpo2Status(loadedData.spO2);
            loadedData.respiratory_rate_status = calculateRespRateStatus(loadedData.respiratory_rate);
            // Calculate BMI value first, then status
            loadedData.bmi = calculateBmiValue(loadedData.height, loadedData.weight);
            loadedData.bmi_status = calculateBmiStatus(loadedData.bmi);

            setFormData(loadedData);
            // Note: Displaying existing files would require backend to send URLs
            // and implementing logic here to show links/previews instead of file inputs.
        } else {
            console.log("No initial vitals found or invalid format. Using default empty state.");
            // Calculate initial BMI based on empty defaults
            const initialBmi = calculateBmiValue(defaultState.height, defaultState.weight);
            defaultState.bmi = initialBmi;
            defaultState.bmi_status = calculateBmiStatus(initialBmi);
            setFormData(defaultState);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]); // Rerun only when the input `data` prop changes

    // --- Effects for Auto-Calculation (Update formData directly) ---
    useEffect(() => { const s = calculateBpStatus(formData.systolic, formData.diastolic); if (s !== formData.bp_status) { setFormData(p => ({ ...p, bp_status: s })); } }, [formData.systolic, formData.diastolic, formData.bp_status]);
    useEffect(() => { const bmiV = calculateBmiValue(formData.height, formData.weight); const bmiS = calculateBmiStatus(bmiV); if (bmiV !== formData.bmi || bmiS !== formData.bmi_status) { setFormData(p => ({ ...p, bmi: bmiV, bmi_status: bmiS })); } }, [formData.height, formData.weight, formData.bmi, formData.bmi_status]);
    useEffect(() => { const s = calculatePulseStatus(formData.pulse); if (s !== formData.pulse_status) { setFormData(p => ({ ...p, pulse_status: s })); } }, [formData.pulse, formData.pulse_status]);
    useEffect(() => { const s = calculateTemperatureStatus(formData.temperature); if (s !== formData.temperature_status) { setFormData(p => ({ ...p, temperature_status: s })); } }, [formData.temperature, formData.temperature_status]);
    useEffect(() => { const s = calculateSpo2Status(formData.spO2); if (s !== formData.spO2_status) { setFormData(p => ({ ...p, spO2_status: s })); } }, [formData.spO2, formData.spO2_status]);
    useEffect(() => { const s = calculateRespRateStatus(formData.respiratory_rate); if (s !== formData.respiratory_rate_status) { setFormData(p => ({ ...p, respiratory_rate_status: s })); } }, [formData.respiratory_rate, formData.respiratory_rate_status]);


    // --- Input Handler ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    // --- File Handlers ---
    const handleFileChange = (event, type) => {
        const file = event.target.files[0];
        // Store the file object using the frontend key (e.g., 'SelfDeclaration')
        setSelectedFiles((prevFiles) => ({ ...prevFiles, [type]: file || null })); // Use null if file is cleared
    };
    const handleBrowseClick = (type) => {
         // Trigger click on the hidden file input element
        document.getElementById(type)?.click();
    };

    // --- Submit Handler (Sends multipart/form-data) ---
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        if (!formData.aadhar) {
            alert("Aadhar number is missing. Cannot submit vitals.");
            return;
        }

        // Create FormData object for multipart submission
        const submissionData = new FormData();

        // Append all non-file fields from formData state
        for (const key in formData) {
            if (formData[key] !== null && formData[key] !== undefined) {
                 // Append the key-value pair. Backend needs to handle type conversion if needed.
                submissionData.append(key, formData[key]);
            }
        }

        // Map frontend file keys to backend model field names
        const fileFieldMapping = {
            SelfDeclaration: 'self_declared',
            FCExternal: 'fc',
            Reports: 'report',
            ManualForms: 'manual',
        };

        // Append files from selectedFiles state, using backend field names
        for (const frontendKey in selectedFiles) {
            const file = selectedFiles[frontendKey];
            if (file instanceof File) { // Check if it's a valid File object
                const backendKey = fileFieldMapping[frontendKey];
                if (backendKey) { // Ensure mapping exists
                    submissionData.append(backendKey, file, file.name); // Append file with its name
                }
            }
        }

        // Log FormData content for debugging (won't show file content easily)
        console.log("Submitting FormData:");
        for (let pair of submissionData.entries()) {
            console.log(pair[0] + ': ' + (pair[1] instanceof File ? `File(${pair[1].name})` : pair[1]));
        }

        // Replace with your actual backend API endpoint URL
        const apiUrl = "https://occupational-health-center-1.onrender.com/addvitals";

        try {
            // Send as multipart/form-data using Axios
            // Axios automatically sets the correct Content-Type header with boundary
            const resp = await axios.post(apiUrl, submissionData, {
                 // headers: {
                 //    'Content-Type': 'multipart/form-data', // ** DO NOT SET MANUALLY **
                 //    // Add CSRF token header if your backend requires it (even with @csrf_exempt, sometimes needed depending on setup)
                 //    // 'X-CSRFToken': getCookie('csrftoken'), // Example function to get CSRF token
                 // }
            });

            // Handle backend response (assuming JSON response)
            if (resp.status === 200 || resp.status === 201) {
                 alert(`Vitals and documents ${resp.status === 201 ? 'added' : 'updated'} successfully!`);
                // Reset file inputs after successful submission
                 setSelectedFiles({ SelfDeclaration: null, FCExternal: null, Reports: null, ManualForms: null });
                 // Optionally reset text inputs or refetch data
                 // setFormData({ ...initial state... }); // Or trigger a data refresh
            } else {
                // Handle non-2xx responses that aren't errors
                console.warn("Vitals/File submission response status not OK:", resp.status, resp.data);
                alert(`Received status ${resp.status}. ${resp.data?.message || resp.data?.error || 'Submission may not be fully successful.'}`);
            }
        } catch (error) {
            // Handle network errors or errors thrown by the backend (e.g., 4xx, 5xx)
            console.error("Error adding/updating vitals and files:", error);
            let errorMsg = "An unexpected error occurred during submission.";
            if (error.response) {
                // Backend returned an error response
                console.error("Server Response Error Data:", error.response.data);
                const errorDetail = error.response.data?.error || error.response.data?.detail || JSON.stringify(error.response.data);
                errorMsg = `Server Error (${error.response.status}): ${errorDetail}`;
            } else if (error.request) {
                // Request was made but no response received
                errorMsg = "Could not connect to the server. Please check network or server status.";
                console.error("No response received:", error.request);
            } else {
                // Error setting up the request
                errorMsg = `Request Setup Error: ${error.message}`;
            }
            alert(errorMsg);
        }
    };

    // --- BP Visualization Function ---
    const renderBpVisualization = (systolic, diastolic, status) => {
        const systolicValue = parseInt(systolic, 10);
        const diastolicValue = parseInt(diastolic, 10);

        if (isNaN(systolicValue) || isNaN(diastolicValue) || systolicValue <= 0 || diastolicValue <= 0 || systolicValue <= diastolicValue) {
            return <div className="text-center text-gray-500 italic text-sm p-4 h-full flex items-center justify-center">Enter valid BP values.</div>;
        }

        let meterColor = "gray";
        let percentValue = 50;
        const meanBP = diastolicValue + (systolicValue - diastolicValue) / 3;

        if (status === 'Low BP (Hypotension)') { meterColor = "blue"; percentValue = 15; }
        else if (status === 'Normal') { meterColor = "green"; percentValue = 35; }
        else if (status === 'High Normal (Prehypertension)') { meterColor = "yellow"; percentValue = 55; }
        else if (status === 'Stage 1 Hypertension') { meterColor = "orange"; percentValue = 75; }
        else if (status === 'Stage 2 Hypertension') { meterColor = "red"; percentValue = 90; }
        else if (status === 'Hypertensive Urgency/Crisis') { meterColor = "red"; percentValue = 100; }

        const colorClass = `text-${meterColor}-600`;
        const svgColorClass = `text-${meterColor}-500`;

        return (
            <div className="text-center p-3 border rounded-lg bg-gray-50 shadow-inner h-full flex flex-col justify-center min-h-[160px]"> {/* Added min-height */}
                <h4 className={`text-md font-semibold ${colorClass} mb-2 break-words`}>{status || 'Calculating...'}</h4>
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto">
                    <svg className="w-full h-full" viewBox="0 0 36 36" transform="rotate(-90)">
                        <circle className="text-gray-300" cx="18" cy="18" r="15.915" strokeWidth="2.5" fill="none" stroke="currentColor" />
                        <circle className={`${svgColorClass} transition-all duration-500 ease-in-out`} cx="18" cy="18" r="15.915" strokeWidth="2.5" strokeDasharray={`${percentValue.toFixed(1)}, 100`} strokeLinecap="round" fill="none" stroke="currentColor" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-xs font-medium text-gray-600">BP</p>
                        <p className={`text-lg font-bold ${colorClass}`}>{systolicValue}/{diastolicValue}</p>
                        <p className="text-[10px] text-gray-500">(MAP: {meanBP.toFixed(0)})</p>
                    </div>
                </div>
            </div>
        );
    };

    // --- BMI Visualization Function ---
    const renderBmiVisualization = (bmi, status) => {
        const bmiValue = parseFloat(bmi);

        if (isNaN(bmiValue) || bmiValue <= 0) {
            return <div className="text-center text-gray-500 italic text-sm p-4 h-full flex items-center justify-center">Enter valid H/W.</div>;
        }

        let meterColor = "gray";
        let percentValue = 50;

        if (status === 'Underweight') { meterColor = "blue"; percentValue = 15; }
        else if (status === 'Normal weight') { meterColor = "green"; percentValue = 35; }
        else if (status === 'Overweight') { meterColor = "yellow"; percentValue = 55; }
        else if (status === 'Obesity') { meterColor = "orange"; percentValue = 75; }
        else if (status === 'Severe Obesity') { meterColor = "red"; percentValue = 90; }

        const colorClass = `text-${meterColor}-600`;
        const svgColorClass = `text-${meterColor}-500`;

        return (
            <div className="text-center p-3 border rounded-lg bg-gray-50 shadow-inner h-full flex flex-col justify-center min-h-[160px]"> {/* Added min-height */}
                <h4 className={`text-md font-semibold ${colorClass} mb-2 break-words`}>{status || 'Calculating...'}</h4>
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto">
                    <svg className="w-full h-full" viewBox="0 0 36 36" transform="rotate(-90)">
                        <circle className="text-gray-300" cx="18" cy="18" r="15.915" strokeWidth="2.5" fill="none" stroke="currentColor" />
                        <circle className={`${svgColorClass} transition-all duration-500 ease-in-out`} cx="18" cy="18" r="15.915" strokeWidth="2.5" strokeDasharray={`${percentValue.toFixed(1)}, 100`} strokeLinecap="round" fill="none" stroke="currentColor" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-xs font-medium text-gray-600">BMI</p>
                        <p className={`text-xl font-bold ${colorClass}`}>{bmiValue.toFixed(1)}</p>
                        {/* <p className="text-[10px] text-gray-500">kg/m²</p> */}
                    </div>
                </div>
            </div>
        );
    };


    return (
        <>
            {/* Render Active Modals */}
            <BpStandardsModal isOpen={isBpModalOpen} onClose={() => setIsBpModalOpen(false)} />
            <BmiStandardsModal isOpen={isBmiModalOpen} onClose={() => setIsBmiModalOpen(false)} />
            <InfoModal isOpen={isPulseModalOpen} onClose={() => setIsPulseModalOpen(false)} title="Pulse Information">
                <p><strong>Normal :</strong> 60 - 100 bpm</p>
                <p><strong>Bradycardia :</strong> &lt; 60 bpm</p>
                <p><strong>Tachycardia :</strong> &gt; 100 bpm</p>
            </InfoModal>
            <InfoModal isOpen={isTempModalOpen} onClose={() => setIsTempModalOpen(false)} title="Temperature Information (°F)">
                <p><strong>Normal :</strong> &lt; 99.1°F </p>
                <p><strong>Low Grade Fever :</strong> 99.1°F - 100.4°F</p>
                <p><strong>Moderate Grade Fever :</strong> 100.5°F - 102.2°F</p>
                <p><strong>High Grade Fever :</strong> 102.3°F - 105.8°F</p>
                <p><strong>Hyperthermic :</strong> &gt; 105.8°F</p>
            </InfoModal>
            <InfoModal isOpen={isSpo2ModalOpen} onClose={() => setIsSpo2ModalOpen(false)} title="SpO₂ Information (%)">
                <p><strong>Normal :</strong> 95% - 100%</p>
                <p><strong>Mild Hypoxemia :</strong> 91% - 94%</p>
                <p><strong>Moderate Hypoxemia :</strong> 86% - 90%</p>
                <p><strong>Severe Hypoxemia :</strong> &lt; 86%</p>
            </InfoModal>
            <InfoModal isOpen={isRespRateModalOpen} onClose={() => setIsRespRateModalOpen(false)} title="Respiratory Rate Information">
                <p><strong>Normal :</strong> 12 - 20 breaths/min</p>
                <p><strong>Bradypnea :</strong>  &lt; 12 breaths/min</p>
                <p><strong>Tachypnea :</strong> &gt; 20 breaths/min</p>
            </InfoModal>


            {/* Main Form Body */}
            <div className="bg-white mt-8 p-4 sm:p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Vitals & Documents Form</h2>

                {/* Form uses the updated handleSubmit */}
                <form onSubmit={handleSubmit} className="space-y-6"> {/* No encType needed, Axios handles it */}

                    {/* --- Aadhar Display (Readonly) --- */}
                    <section className="p-4 border rounded-lg bg-slate-50 shadow-sm">
                         <h3 className="text-md font-semibold text-gray-700 mb-2">Identifier</h3>
                         <div>
                            <label htmlFor="aadhar_display" className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
                            <input
                                id="aadhar_display"
                                name="aadhar_display" // Not submitted
                                readOnly
                                value={formData.aadhar || 'Not available'}
                                type="text"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed focus:outline-none sm:text-sm"
                                tabIndex={-1}
                            />
                         </div>
                    </section>

                    {/* --- Blood Pressure Section --- */}
                    <section className="p-4 border rounded-lg bg-slate-50 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                             <h3 className="text-lg font-semibold text-gray-700">Blood Pressure</h3>
                             <button type="button" onClick={() => setIsBpModalOpen(true)} className="text-blue-500 hover:text-blue-700" title="View Blood Pressure Standards"> <FaInfoCircle size={18} /> </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                            <div className="md:col-span-2 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Systolic Input */}
                                     <div>
                                        <label htmlFor="systolic" className="block text-sm font-medium text-gray-700 mb-1">Systolic <span className='text-xs'>(mmHg)</span></label>
                                        <input id="systolic" name="systolic" onChange={handleInputChange} value={formData.systolic || ''} type="number" placeholder="e.g., 120" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" />
                                     </div>
                                     {/* Diastolic Input */}
                                     <div>
                                        <label htmlFor="diastolic" className="block text-sm font-medium text-gray-700 mb-1">Diastolic <span className='text-xs'>(mmHg)</span></label>
                                        <input id="diastolic" name="diastolic" onChange={handleInputChange} value={formData.diastolic || ''} type="number" placeholder="e.g., 80" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" />
                                     </div>
                                </div>
                                <div>
                                    <label htmlFor="bp_status" className="block text-sm font-medium text-gray-700">Overall BP Status</label>
                                    <input id="bp_status" name="bp_status" readOnly value={formData.bp_status || ''} type="text" placeholder="Auto-calculated" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed focus:outline-none sm:text-sm" tabIndex={-1} />
                                </div>
                            </div>
                            <div className="md:col-span-1 flex items-center justify-center mt-4 md:mt-0">
                                {/* Pass status to BP visualization */}
                                {renderBpVisualization(formData.systolic, formData.diastolic, formData.bp_status)}
                            </div>
                        </div>
                    </section>

                    {/* --- Pulse Section --- */}
                    <section className="p-4 border rounded-lg bg-slate-50 shadow-sm">
                        <div className="flex justify-between items-center mb-3"> <h3 className="text-md font-semibold text-gray-700">Pulse <span className='text-xs font-normal'>(/min)</span></h3> <button type="button" onClick={() => setIsPulseModalOpen(true)} className="text-blue-500 hover:text-blue-700" title="Pulse Information"> <FaInfoCircle size={16} /> </button> </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div> <label htmlFor="pulse" className="block text-sm font-medium text-gray-700 mb-1">Value</label> <input id="pulse" name="pulse" onChange={handleInputChange} value={formData.pulse || ''} type="number" placeholder="e.g., 72" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" /> </div>
                            <div> <label htmlFor="pulse_status" className="block text-sm font-medium text-gray-700 mb-1">Status</label> <input id="pulse_status" name="pulse_status" readOnly value={formData.pulse_status || ''} type="text" placeholder="Auto-calculated" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed focus:outline-none sm:text-sm" tabIndex={-1} /> </div>
                            <div> <label htmlFor="pulse_comment" className="block text-sm font-medium text-gray-700 mb-1">Comment</label> <input id="pulse_comment" name="pulse_comment" onChange={handleInputChange} value={formData.pulse_comment || ''} type="text" placeholder="Optional" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" /> </div>
                        </div>
                    </section>

                    {/* --- Temperature Section --- */}
                    <section className="p-4 border rounded-lg bg-slate-50 shadow-sm">
                        <div className="flex justify-between items-center mb-3"> <h3 className="text-md font-semibold text-gray-700">Temperature <span className='text-xs font-normal'>(°F)</span></h3> <button type="button" onClick={() => setIsTempModalOpen(true)} className="text-blue-500 hover:text-blue-700" title="Temperature Information"> <FaInfoCircle size={16} /> </button> </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div> <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">Value</label> <input id="temperature" name="temperature" onChange={handleInputChange} value={formData.temperature || ''} type="number" step="0.1" placeholder="e.g., 98.6" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" /> </div>
                            <div> <label htmlFor="temperature_status" className="block text-sm font-medium text-gray-700 mb-1">Status</label> <input id="temperature_status" name="temperature_status" readOnly value={formData.temperature_status || ''} type="text" placeholder="Auto-calculated" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed focus:outline-none sm:text-sm" tabIndex={-1} /> </div>
                            <div> <label htmlFor="temperature_comment" className="block text-sm font-medium text-gray-700 mb-1">Comment</label> <input id="temperature_comment" name="temperature_comment" onChange={handleInputChange} value={formData.temperature_comment || ''} type="text" placeholder="Optional" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" /> </div>
                        </div>
                    </section>

                    {/* --- SpO2 Section --- */}
                    <section className="p-4 border rounded-lg bg-slate-50 shadow-sm">
                        <div className="flex justify-between items-center mb-3"> <h3 className="text-md font-semibold text-gray-700">SpO₂ <span className='text-xs font-normal'>(%)</span></h3> <button type="button" onClick={() => setIsSpo2ModalOpen(true)} className="text-blue-500 hover:text-blue-700" title="SpO₂ Information"> <FaInfoCircle size={16} /> </button> </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div> <label htmlFor="spO2" className="block text-sm font-medium text-gray-700 mb-1">Value</label> <input id="spO2" name="spO2" onChange={handleInputChange} value={formData.spO2 || ''} type="number" placeholder="e.g., 98" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" /> </div>
                            <div> <label htmlFor="spO2_status" className="block text-sm font-medium text-gray-700 mb-1">Status</label> <input id="spO2_status" name="spO2_status" readOnly value={formData.spO2_status || ''} type="text" placeholder="Auto-calculated" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed focus:outline-none sm:text-sm" tabIndex={-1} /> </div>
                            <div> <label htmlFor="spO2_comment" className="block text-sm font-medium text-gray-700 mb-1">Comment</label> <input id="spO2_comment" name="spO2_comment" onChange={handleInputChange} value={formData.spO2_comment || ''} type="text" placeholder="Optional" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" /> </div>
                        </div>
                    </section>

                    {/* --- Respiratory Rate Section --- */}
                    <section className="p-4 border rounded-lg bg-slate-50 shadow-sm">
                        <div className="flex justify-between items-center mb-3"> <h3 className="text-md font-semibold text-gray-700">Respiratory Rate <span className='text-xs font-normal'>(/min)</span></h3> <button type="button" onClick={() => setIsRespRateModalOpen(true)} className="text-blue-500 hover:text-blue-700" title="Respiratory Rate Information"> <FaInfoCircle size={16} /> </button> </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div> <label htmlFor="respiratory_rate" className="block text-sm font-medium text-gray-700 mb-1">Value</label> <input id="respiratory_rate" name="respiratory_rate" onChange={handleInputChange} value={formData.respiratory_rate || ''} type="number" placeholder="e.g., 16" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" /> </div>
                            <div> <label htmlFor="respiratory_rate_status" className="block text-sm font-medium text-gray-700 mb-1">Status</label> <input id="respiratory_rate_status" name="respiratory_rate_status" readOnly value={formData.respiratory_rate_status || ''} type="text" placeholder="Auto-calculated" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed focus:outline-none sm:text-sm" tabIndex={-1} /> </div>
                            <div> <label htmlFor="respiratory_rate_comment" className="block text-sm font-medium text-gray-700 mb-1">Comment</label> <input id="respiratory_rate_comment" name="respiratory_rate_comment" onChange={handleInputChange} value={formData.respiratory_rate_comment || ''} type="text" placeholder="Optional" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" /> </div>
                        </div>
                    </section>

                    {/* --- Height, Weight, BMI Section --- */}
                    <section className="p-4 border rounded-lg bg-slate-50 shadow-sm space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                            {/* Column 1: Inputs and Readouts */}
                            <div className='space-y-4'>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Height Input */}
                                    <div>
                                         <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">Height <span className='text-xs font-normal'>(cm)</span></label>
                                         <input id="height" name="height" onChange={handleInputChange} value={formData.height || ''} type="number" placeholder="e.g., 175" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" />
                                    </div>
                                    {/* Weight Input */}
                                    <div>
                                        <label htmlFor='weight' className="block text-sm font-medium text-gray-700 mb-1">Weight <span className='text-xs font-normal'>(Kg)</span></label>
                                        <input id='weight' name="weight" onChange={handleInputChange} value={formData.weight || ''} type="number" step="0.1" placeholder="e.g., 70.5" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" />
                                    </div>
                                </div>
                                {/* BMI Details */}
                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex justify-between items-center mb-1">
                                         <h4 className="text-md font-semibold text-gray-700">BMI <span className='text-xs font-normal'>(kg/m²)</span></h4>
                                         <button type="button" onClick={() => setIsBmiModalOpen(true)} className="text-blue-500 hover:text-blue-700" title="View BMI Standards"> <FaInfoCircle size={16}/> </button>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <label htmlFor="bmi" className="block text-sm font-medium text-gray-700 mb-1">Calculated BMI</label>
                                            <input id="bmi" name="bmi" readOnly value={formData.bmi || ''} type="text" placeholder="Enter H/W" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed focus:outline-none sm:text-sm" tabIndex={-1} />
                                        </div>
                                        <div>
                                            <label htmlFor="bmi_status" className="block text-sm font-medium text-gray-700 mb-1">BMI Status</label>
                                            <input id="bmi_status" name="bmi_status" readOnly value={formData.bmi_status || ''} type="text" placeholder="Auto-calculated" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed focus:outline-none sm:text-sm" tabIndex={-1} />
                                        </div>
                                        <div>
                                            <label htmlFor="bmi_comment" className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                                            <input id="bmi_comment" name="bmi_comment" onChange={handleInputChange} value={formData.bmi_comment || ''} type="text" placeholder="Optional" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Column 2: BMI Visualization */}
                            <div className="flex items-center justify-center pt-5 md:pt-0">
                                {renderBmiVisualization(formData.bmi, formData.bmi_status)}
                            </div>
                        </div>
                    </section>

                    {/* --- File Upload Section --- */}
                    <section className="pt-5 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">Upload Documents</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {/* Map over frontend keys */}
                            {['SelfDeclaration', 'FCExternal', 'Reports', 'ManualForms']
                            .filter(uploadType => type !== "Visitor" || ['Reports', 'ManualForms'].includes(uploadType)) // Optional filtering based on props
                            .map((keyName) => ( // keyName is 'SelfDeclaration', etc.
                                <div key={keyName}>
                                    {/* Display formatted label */}
                                    <label className="block text-sm font-medium text-gray-600 mb-1">{keyName.replace(/([A-Z])/g, ' $1').trim()}</label>
                                    {/* Clickable area to trigger file input */}
                                    <motion.div
                                        className="relative border border-gray-300 rounded-md p-2 flex items-center justify-between text-sm cursor-pointer bg-white hover:bg-gray-50"
                                        onClick={() => handleBrowseClick(keyName)} // Use keyName for ID lookup
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {/* Display file name from selectedFiles state or placeholder */}
                                        <span className={`truncate ${selectedFiles[keyName] ? 'text-gray-800' : 'text-gray-400'}`}>
                                            {selectedFiles[keyName] ? selectedFiles[keyName].name : 'Choose file...'}
                                        </span>
                                        <FaFileUpload className="text-blue-500 ml-2 flex-shrink-0" />
                                        {/* Hidden actual file input */}
                                        <input
                                            type="file"
                                            id={keyName} // ID matches keyName
                                            style={{ display: "none" }}
                                            onChange={(e) => handleFileChange(e, keyName)} // Pass keyName
                                            accept=".pdf,.jpg,.jpeg,.png,image/*" // Adjust accepted file types as needed
                                        />
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* --- Submit Button --- */}
                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 text-base"
                            disabled={!formData.aadhar} // Disable if Aadhar is missing
                            title={!formData.aadhar ? "Aadhar number is required to submit" : "Submit Vitals & Documents"}
                        >
                            Submit Vitals & Documents
                        </button>
                    </div>
                </form>
            </div>

            {/* Inline styles for dynamic Tailwind classes (ensure these are generated by Tailwind config ideally) */}
            <style jsx>{`
                .text-blue-600 { color: #2563eb; } .text-blue-500 { color: #3b82f6; }
                .text-green-600 { color: #16a34a; } .text-green-500 { color: #22c55e; }
                .text-yellow-600 { color: #ca8a04; } .text-yellow-500 { color: #eab308; }
                .text-orange-600 { color: #ea580c; } .text-orange-500 { color: #f97316; }
                .text-red-600 { color: #dc2626; } .text-red-500 { color: #ef4444; }
                .text-gray-600 { color: #4b5563; } .text-gray-500 { color: #6b7280; } .text-gray-300 { color: #d1d5db; }

                /* Style for disabled submit button */
                button:disabled {
                    background-color: #93c5fd; /* Tailwind bg-blue-300 */
                    cursor: not-allowed;
                    opacity: 0.7;
                }
                button:disabled:hover {
                    background-color: #93c5fd; /* Keep the disabled color on hover */
                }

                /* Ensure visualization containers have a minimum height */
                 .min-h-\[160px\] { min-height: 160px; } /* Adjust as needed */
            `}</style>
        </>
    );
};

export default VitalsForm;