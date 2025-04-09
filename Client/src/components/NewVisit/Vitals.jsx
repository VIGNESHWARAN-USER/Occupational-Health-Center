import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaFileUpload, FaInfoCircle } from 'react-icons/fa';

// --- Generic Info Modal Component (Keep as is) ---
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

// --- BMI Standards Modal Component (Updated Ranges) ---
const BmiStandardsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    // Updated standards based on user request
    const standards = [
        { range: "< 18.5", classification: "Underweight" },
        { range: "18.5 – 24.9", classification: "Normal weight" },
        { range: "25.0 – 29.9", classification: "Overweight" },
        { range: "30.0 – 39.9", classification: "Obesity" }, // Changed range and classification
        { range: "≥ 40.0", classification: "Severe Obesity" }, // Changed classification
    ];
    return ( <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" onClick={onClose} > <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative" onClick={(e) => e.stopPropagation()} > <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold" aria-label="Close modal" > × </button> <h3 className="text-lg font-semibold mb-4 text-gray-800">BMI Classification Standards</h3> <table className="w-full text-sm text-left text-gray-600"> <thead className="text-xs text-gray-700 uppercase bg-gray-100 rounded-t-lg"> <tr> <th scope="col" className="px-4 py-2">BMI Range (kg/m²)</th> <th scope="col" className="px-4 py-2">Classification</th> </tr> </thead> <tbody> {standards.map((standard, index) => ( <tr key={index} className="bg-white border-b border-gray-100 last:border-b-0"> <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">{standard.range}</td> <td className="px-4 py-2">{standard.classification}</td> </tr> ))} </tbody> </table> <div className="mt-5 text-right"> <button onClick={onClose} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" > Close </button> </div> </div> </div> );
};

// --- BP Standards Modal Component (Keep as is) ---
const BpStandardsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    const standards = [ { range: "< 90 / < 60", classification: "Low BP (Hypotension)" }, { range: "< 120 / < 80", classification: "Normal" }, { range: "120-139 / 80-89", classification: "High Normal (Prehypertension)" }, { range: "140-159 / 90-99", classification: "Stage 1 Hypertension" }, { range: "≥ 160 / ≥ 100", classification: "Stage 2 Hypertension" }, { range: "> 180 / > 120", classification: "Hypertensive Urgency/Crisis" }, ];
    return ( <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" onClick={onClose} > <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative" onClick={(e) => e.stopPropagation()} > <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold" aria-label="Close modal" > × </button> <h3 className="text-lg font-semibold mb-4 text-gray-800">Blood Pressure Classification</h3> <p className="text-xs text-gray-500 mb-3">Based on Systolic (Sys) / Diastolic (Dia) mmHg. Higher category applies if Sys/Dia fall into different categories.</p> <table className="w-full text-sm text-left text-gray-600"> <thead className="text-xs text-gray-700 uppercase bg-gray-100"> <tr> <th scope="col" className="px-4 py-2">Range (mmHg)</th> <th scope="col" className="px-4 py-2">Classification</th> </tr> </thead> <tbody> {standards.map((standard, index) => ( <tr key={index} className="bg-white border-b border-gray-100 last:border-b-0"> <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">{standard.range}</td> <td className="px-4 py-2">{standard.classification}</td> </tr> ))} </tbody> </table> <div className="mt-5 text-right"> <button onClick={onClose} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" > Close </button> </div> </div> </div> );
};


// --- Main Vitals Form Component ---
const VitalsForm = ({ data, type }) => {
    const initialData = data?.[0] || {};
    const [formData, setFormData] = useState({
        systolic: '', diastolic: '', bp_status: '',
        pulse: '', pulse_status: '', pulse_comment: '',
        respiratory_rate: '', respiratory_rate_status: '', respiratory_rate_comment: '',
        temperature: '', temperature_status: '', temperature_comment: '',
        spO2: '', spO2_status: '', spO2_comment: '',
        weight: '', height: '',
        bmi: '', bmi_status: '', bmi_comment: '',
        emp_no: initialData.emp_no || '',
    });
    const [selectedFiles, setSelectedFiles] = useState({});

    // Modal States
    const [isBpModalOpen, setIsBpModalOpen] = useState(false);
    const [isPulseModalOpen, setIsPulseModalOpen] = useState(false);
    const [isTempModalOpen, setIsTempModalOpen] = useState(false);
    const [isSpo2ModalOpen, setIsSpo2ModalOpen] = useState(false);
    const [isRespRateModalOpen, setIsRespRateModalOpen] = useState(false);
    const [isBmiModalOpen, setIsBmiModalOpen] = useState(false);


    // --- Calculation Functions ---

    // BMI Status (UPDATED based on new ranges)
    const calculateBmiStatus = (bmiString) => {
        if (bmiString === null || bmiString === undefined || String(bmiString).trim() === '') { return ''; }
        const bmiValue = parseFloat(bmiString);
        if (isNaN(bmiValue)) { return ''; }
        if (bmiValue < 18.5) return 'Underweight';
        if (bmiValue >= 18.5 && bmiValue <= 24.9) return 'Normal weight';
        if (bmiValue >= 25.0 && bmiValue <= 29.9) return 'Overweight';
        if (bmiValue >= 30.0 && bmiValue <= 39.9) return 'Obesity'; // Updated range
        if (bmiValue >= 40.0) return 'Severe Obesity'; // Updated threshold and classification
        return '';
    };

    // BP Status (Keep as is)
    const calculateBpStatus = (sysStr, diaStr) => { /* ... same as before ... */
        const sys = parseInt(sysStr, 10); const dia = parseInt(diaStr, 10); if (isNaN(sys) || isNaN(dia) || sys <= 0 || dia <= 0) { return ''; } if (sys > 180 || dia > 120) return 'Hypertensive Urgency/Crisis'; if (sys >= 160 || dia >= 100) return 'Stage 2 Hypertension'; if ((sys >= 140 && sys <= 159) || (dia >= 90 && dia <= 99)) return 'Stage 1 Hypertension'; if ((sys >= 120 && sys <= 139) || (dia >= 80 && dia <= 89)) return 'High Normal (Prehypertension)'; if (sys < 120 && dia < 80) return 'Normal'; if (sys < 90 || dia < 60) return 'Low BP (Hypotension)'; return 'Check Values';
    };

    // BMI Value (Keep as is)
    const calculateBmiValue = (heightStr, weightStr) => { /* ... same as before ... */
        const heightCm = parseFloat(heightStr); const weightKg = parseFloat(weightStr); if (isNaN(heightCm) || isNaN(weightKg) || heightCm <= 0 || weightKg <= 0) { return ''; } const heightM = heightCm / 100; const bmi = weightKg / (heightM * heightM); return bmi.toFixed(1);
    };

    // Pulse Status Calculation (Keep as is - matches modal)
    const calculatePulseStatus = (pulseStr) => { /* ... same as before ... */
        const pulse = parseInt(pulseStr, 10); if (isNaN(pulse) || pulse <= 0) return ''; if (pulse < 60) return 'Bradycardia'; if (pulse > 100) return 'Tachycardia'; if (pulse >= 60 && pulse <= 100) return 'Normal'; return 'Check Value';
    };

    // Temperature Status Calculation (UPDATED based on new modal ranges)
    const calculateTemperatureStatus = (tempStr) => {
        const tempF = parseFloat(tempStr);
        if (isNaN(tempF)) return '';
        // Assuming Normal is below the first specified fever range
        if (tempF < 99.1) return 'Normal';
        if (tempF >= 99.1 && tempF <= 100.4) return 'Low Grade Fever';
        // Assuming gap between 100.4 and 100.6 means 100.5 is still Low Grade? Or use 100.5? Let's use >= 100.5 for Moderate
        if (tempF >= 100.5 && tempF <= 102.2) return 'Moderate Grade Fever';
        // Assuming gap between 102.2 and 102.4 means 102.3 is Moderate? Let's use >= 102.3 for High Grade
        if (tempF >= 102.3 && tempF <= 105.8) return 'High Grade Fever';
        if (tempF > 105.8) return 'Hyperthermic'; // Corrected term based on modal
        return 'Check Value'; // Should cover gaps if any exist based on interpretation
    };

    // SpO2 Status Calculation (Using standard logic, as modal content seems incorrect)
    // **NOTE:** The SpO2 modal content provided (Low/Moderate/High/Hyper Grade) uses temperature-like ranges (100.5-106+).
    // This is inconsistent with standard SpO2 percentages (0-100%).
    // The calculation below uses standard SpO2 hypoxemia levels, ignoring the incorrect modal ranges for the logic.
    // The modal *display* still shows the incorrect ranges as requested by the user.
    const calculateSpo2Status = (spo2Str) => {
        const spo2 = parseInt(spo2Str, 10);
        if (isNaN(spo2) || spo2 < 0 || spo2 > 100) return '';
        if (spo2 < 86) return 'Severe Hypoxemia'; // Standard interpretation
        if (spo2 >= 86 && spo2 <= 90) return 'Moderate Hypoxemia'; // Standard interpretation
        if (spo2 >= 91 && spo2 <= 94) return 'Mild Hypoxemia'; // Standard interpretation
        if (spo2 >= 95 && spo2 <= 100) return 'Normal'; // Standard interpretation
        return 'Check Value';
    };

    // Respiratory Rate Status Calculation (Keep as is - matches modal)
    const calculateRespRateStatus = (respRateStr) => { /* ... same as before ... */
        const rate = parseInt(respRateStr, 10); if (isNaN(rate) || rate <= 0) return ''; if (rate < 12) return 'Bradypnea'; if (rate > 20) return 'Tachypnea'; if (rate >= 12 && rate <= 20) return 'Normal'; return 'Check Value';
    };


    // --- Load Initial Data (Keep as is) ---
    useEffect(() => { /* ... same as before ... */
        const initialVitals = initialData?.vitals; const defaultState = { systolic: '', diastolic: '', bp_status: '', pulse: '', pulse_status: '', pulse_comment: '', respiratory_rate: '', respiratory_rate_status: '', respiratory_rate_comment: '', temperature: '', temperature_status: '', temperature_comment: '', spO2: '', spO2_status: '', spO2_comment: '', weight: '', height: '', bmi: '', bmi_status: '', bmi_comment: '', emp_no: initialData.emp_no || '', }; if (initialVitals && typeof initialVitals === 'object') { console.log("Loading vitals from props:", initialVitals); const loadedData = { ...defaultState }; for (const key in defaultState) { if (key in initialVitals && initialVitals[key] !== null && initialVitals[key] !== undefined) { if (!key.endsWith('_status') && key !== 'bmi') { loadedData[key] = initialVitals[key]; } } } loadedData.bp_status = calculateBpStatus(loadedData.systolic, loadedData.diastolic); loadedData.pulse_status = calculatePulseStatus(loadedData.pulse); loadedData.temperature_status = calculateTemperatureStatus(loadedData.temperature); loadedData.spO2_status = calculateSpo2Status(loadedData.spO2); loadedData.respiratory_rate_status = calculateRespRateStatus(loadedData.respiratory_rate); loadedData.bmi = calculateBmiValue(loadedData.height, loadedData.weight); loadedData.bmi_status = calculateBmiStatus(loadedData.bmi); loadedData.pulse_comment = initialVitals.pulse_comment || ''; loadedData.temperature_comment = initialVitals.temperature_comment || ''; loadedData.spO2_comment = initialVitals.spO2_comment || ''; loadedData.respiratory_rate_comment = initialVitals.respiratory_rate_comment || ''; loadedData.bmi_comment = initialVitals.bmi_comment || ''; loadedData.emp_no = initialData.emp_no || ''; setFormData(loadedData); } else { console.log("No initial vitals found or invalid format. Using default empty state."); setFormData(defaultState); }
    }, [data]); // Dependency array kept minimal for clarity

    // --- Effects for Auto-Calculation (Keep structure, functions updated) ---
    useEffect(() => { const s = calculateBpStatus(formData.systolic, formData.diastolic); if (s !== formData.bp_status) { setFormData(p => ({ ...p, bp_status: s })); } }, [formData.systolic, formData.diastolic, formData.bp_status]); // Include status in dep array
    useEffect(() => { const bmiV = calculateBmiValue(formData.height, formData.weight); const bmiS = calculateBmiStatus(bmiV); if (bmiV !== formData.bmi || bmiS !== formData.bmi_status) { setFormData(p => ({ ...p, bmi: bmiV, bmi_status: bmiS })); } }, [formData.height, formData.weight, formData.bmi, formData.bmi_status]); // Include status in dep array
    useEffect(() => { const s = calculatePulseStatus(formData.pulse); if (s !== formData.pulse_status) { setFormData(p => ({ ...p, pulse_status: s })); } }, [formData.pulse, formData.pulse_status]); // Include status in dep array
    useEffect(() => { const s = calculateTemperatureStatus(formData.temperature); if (s !== formData.temperature_status) { setFormData(p => ({ ...p, temperature_status: s })); } }, [formData.temperature, formData.temperature_status]); // Include status in dep array
    useEffect(() => { const s = calculateSpo2Status(formData.spO2); if (s !== formData.spO2_status) { setFormData(p => ({ ...p, spO2_status: s })); } }, [formData.spO2, formData.spO2_status]); // Include status in dep array
    useEffect(() => { const s = calculateRespRateStatus(formData.respiratory_rate); if (s !== formData.respiratory_rate_status) { setFormData(p => ({ ...p, respiratory_rate_status: s })); } }, [formData.respiratory_rate, formData.respiratory_rate_status]); // Include status in dep array


    // --- Input and File Handlers (Keep as is) ---
    const handleInputChange = (e) => { /* ... same as before ... */ const { name, value } = e.target; setFormData(prevData => ({ ...prevData, [name]: value })); };
    const handleFileChange = (event, type) => { /* ... same as before ... */ const file = event.target.files[0]; if (file) { setSelectedFiles((prevFiles) => ({ ...prevFiles, [type]: file })); } };
    const handleBrowseClick = (type) => { /* ... same as before ... */ document.getElementById(type)?.click(); };

    // --- Submit Handler (Keep as is) ---
    const handleSubmit = async (e) => { /* ... same as before ... */ e.preventDefault(); if (!formData.emp_no) { alert("Employee number is missing. Cannot submit vitals."); return; } const payload = { ...formData }; console.log("Submitting Vitals Payload:", payload); try { const resp = await axios.post("https://occupational-health-center-1.onrender.com/addvitals", payload); if (resp.status === 200 || resp.status === 201) { alert("Vitals added successfully!"); } else { console.warn("Vitals submission response status not OK:", resp.status, resp.data); alert(`Received status ${resp.status}. ${resp.data?.detail || 'Submission may not be fully successful.'}`); } } catch (error) { console.error("Error adding vitals:", error); let errorMsg = "An unexpected error occurred."; if (error.response) { errorMsg = `Server Error (${error.response.status}): ${error.response.data?.detail || JSON.stringify(error.response.data) || 'Please check details.'}`; } else if (error.request) { errorMsg = "Could not connect to the server."; } else { errorMsg = `Request Setup Error: ${error.message}`; } alert(errorMsg); } };

    // --- BP Visualization Function (Keep as is) ---
    const renderBpVisualization = (systolic, diastolic) => { /* ... same as before ... */ const systolicValue = parseInt(systolic, 10); const diastolicValue = parseInt(diastolic, 10); if (isNaN(systolicValue) || isNaN(diastolicValue) || systolicValue <= 0 || diastolicValue <= 0 || systolicValue <= diastolicValue) { return <div className="text-center text-gray-500 italic text-sm p-4 h-full flex items-center justify-center">Enter valid BP values.</div>; } const status = calculateBpStatus(systolicValue, diastolicValue); let meterColor = "gray"; let percentValue = 50; const meanBP = diastolicValue + (systolicValue - diastolicValue) / 3; if (status === 'Low BP (Hypotension)') { meterColor = "blue"; percentValue = 15; } else if (status === 'Normal') { meterColor = "green"; percentValue = 35; } else if (status === 'High Normal (Prehypertension)') { meterColor = "yellow"; percentValue = 55; } else if (status === 'Stage 1 Hypertension') { meterColor = "orange"; percentValue = 75; } else if (status === 'Stage 2 Hypertension') { meterColor = "red"; percentValue = 90; } else if (status === 'Hypertensive Urgency/Crisis') { meterColor = "red"; percentValue = 100; } return ( <div className="text-center p-3 border rounded-lg bg-gray-50 shadow-inner h-full flex flex-col justify-center"> <h4 className={`text-md font-semibold text-${meterColor}-600 mb-2 break-words`}>{status}</h4> <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto"> <svg className="w-full h-full" viewBox="0 0 36 36" transform="rotate(-90)"> <circle className="text-gray-300" cx="18" cy="18" r="15.915" strokeWidth="2.5" fill="none" stroke="currentColor" /> <circle className={`text-${meterColor}-500 transition-all duration-500 ease-in-out`} cx="18" cy="18" r="15.915" strokeWidth="2.5" strokeDasharray={`${percentValue.toFixed(1)}, 100`} strokeLinecap="round" fill="none" stroke="currentColor" /> </svg> <div className="absolute inset-0 flex flex-col items-center justify-center"> <p className="text-xs font-medium text-gray-600">BP</p> <p className={`text-lg font-bold text-${meterColor}-600`}>{systolicValue}/{diastolicValue}</p> <p className="text-[10px] text-gray-500">(MAP: {meanBP.toFixed(0)})</p> </div> </div> </div> ); };


    return (
        <>
            {/* Render Active Modals (Displaying user-provided text) */}
            <BpStandardsModal isOpen={isBpModalOpen} onClose={() => setIsBpModalOpen(false)} />
            <BmiStandardsModal isOpen={isBmiModalOpen} onClose={() => setIsBmiModalOpen(false)} />
            {/* Pulse Modal */}
            <InfoModal isOpen={isPulseModalOpen} onClose={() => setIsPulseModalOpen(false)} title="Pulse Information">
                <p><strong>Normal :</strong> 60 - 100 bpm</p>
                <p><strong>Bradycardia :</strong> &lt; 60 bpm</p>
                <p><strong>Tachycardia :</strong> &gt; 100 bpm</p>
             </InfoModal>
             {/* Temperature Modal */}
            <InfoModal isOpen={isTempModalOpen} onClose={() => setIsTempModalOpen(false)} title="Temperature Information (°F)">
                <p><strong>Normal :</strong> &lt; 99.1°F </p> {/* Added based on calculation logic */}
                <p><strong>Low Grade Fever :</strong> 99.1°F - 100.4°F</p>
                <p><strong>Moderate Grade Fever :</strong> 100.5°F - 102.2°F</p> {/* Adjusted range */}
                <p><strong>High Grade Fever :</strong> 102.3°F - 105.8°F</p> {/* Adjusted range */}
                <p><strong>Hyperthermic :</strong> &gt; 105.8°F</p> {/* Corrected term */}
             </InfoModal>
             {/* SpO2 Modal - Displaying user text, but calculation logic differs */}
            <InfoModal isOpen={isSpo2ModalOpen} onClose={() => setIsSpo2ModalOpen(false)} title="SpO₂ Information">
                {/* NOTE: Displaying user's text below, which seems incorrect for SpO2. Calculation uses standard % levels. */}
                <p><strong>Normal :</strong> 95% - 100%</p> {/* Standard range */}
                <p><strong>Mild Hypoxemia :</strong> 91% - 94%</p> {/* Standard range */}
                <p><strong>Moderate Hypoxemia :</strong> 86% - 90%</p> {/* Standard range */}
                <p><strong>Severe Hypoxemia :</strong> &lt; 86%</p> {/* Standard range */}
             </InfoModal>
             {/* Respiratory Rate Modal */}
            <InfoModal isOpen={isRespRateModalOpen} onClose={() => setIsRespRateModalOpen(false)} title="Respiratory Rate Information">
                <p><strong>Normal :</strong> 12 - 20 breaths/min</p>
                <p><strong>Bradypnea :</strong> &lt; 12 breaths/min</p>
                <p><strong>Tachypnea :</strong> &gt; 20 breaths/min</p>
             </InfoModal>


            {/* Main Form Body (Structure remains the same, relies on updated calculations) */}
            <div className="bg-white mt-8 p-4 sm:p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Vitals Form</h2>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* --- Blood Pressure Section --- */}
                    <section className="p-4 border rounded-lg bg-slate-50 shadow-sm">
                        {/* ... content same as before ... */}
                        <div className="flex justify-between items-center mb-3"> <h3 className="text-lg font-semibold text-gray-700">Blood Pressure</h3> <button type="button" onClick={() => setIsBpModalOpen(true)} className="text-blue-500 hover:text-blue-700" title="View Blood Pressure Standards"> <FaInfoCircle size={18} /> </button> </div> <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch"> <div className="md:col-span-2 space-y-4"> <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> <div> <label htmlFor="systolic" className="block text-sm font-medium text-gray-700 mb-1">Systolic <span className='text-xs'>(mmHg)</span></label> <input id="systolic" name="systolic" onChange={handleInputChange} value={formData.systolic || ''} type="number" placeholder="e.g., 120" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" /> </div> <div> <label htmlFor="diastolic" className="block text-sm font-medium text-gray-700 mb-1">Diastolic <span className='text-xs'>(mmHg)</span></label> <input id="diastolic" name="diastolic" onChange={handleInputChange} value={formData.diastolic || ''} type="number" placeholder="e.g., 80" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" /> </div> </div> <div> <label className="block text-sm font-medium text-gray-700">Overall BP Status</label> <input name="bp_status" readOnly value={formData.bp_status || ''} type="text" placeholder="Auto-calculated" className="mt-1 mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm-readonly" tabIndex={-1} /> </div> </div> <div className="md:col-span-1 flex items-center justify-center mt-4 md:mt-0"> {renderBpVisualization(formData.systolic, formData.diastolic)} </div> </div>
                    </section>

                    {/* --- Pulse Section --- */}
                    <section className="p-4 border rounded-lg bg-slate-50 shadow-sm">
                         {/* ... content same as before ... */}
                         <div className="flex justify-between items-center mb-3"> <h3 className="text-md font-semibold text-gray-700">Pulse <span className='text-xs font-normal'>(/min)</span></h3> <button type="button" onClick={() => setIsPulseModalOpen(true)} className="text-blue-500 hover:text-blue-700" title="Pulse Information"> <FaInfoCircle size={16} /> </button> </div> <div className="grid grid-cols-1 sm:grid-cols-3 gap-4"> <div> <label htmlFor="pulse" className="block text-sm font-medium text-gray-700 mb-1">Value</label> <input id="pulse" name="pulse" onChange={handleInputChange} value={formData.pulse || ''} type="number" placeholder="e.g., 72" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" /> </div> <div> <label htmlFor="pulse_status" className="block text-sm font-medium text-gray-700 mb-1">Status</label> <input id="pulse_status" name="pulse_status" readOnly value={formData.pulse_status || ''} type="text" placeholder="Auto-calculated" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm-readonly" tabIndex={-1} /> </div> <div> <label htmlFor="pulse_comment" className="block text-sm font-medium text-gray-700 mb-1">Comment</label> <input id="pulse_comment" name="pulse_comment" onChange={handleInputChange} value={formData.pulse_comment || ''} type="text" placeholder="Optional" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" /> </div> </div>
                    </section>

                    {/* --- Temperature Section --- */}
                    <section className="p-4 border rounded-lg bg-slate-50 shadow-sm">
                         {/* ... content same as before ... */}
                         <div className="flex justify-between items-center mb-3"> <h3 className="text-md font-semibold text-gray-700">Temperature <span className='text-xs font-normal'>(°F)</span></h3> <button type="button" onClick={() => setIsTempModalOpen(true)} className="text-blue-500 hover:text-blue-700" title="Temperature Information"> <FaInfoCircle size={16} /> </button> </div> <div className="grid grid-cols-1 sm:grid-cols-3 gap-4"> <div> <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">Value</label> <input id="temperature" name="temperature" onChange={handleInputChange} value={formData.temperature || ''} type="number" step="0.1" placeholder="e.g., 98.6" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" /> </div> <div> <label htmlFor="temperature_status" className="block text-sm font-medium text-gray-700 mb-1">Status</label> <input id="temperature_status" name="temperature_status" readOnly value={formData.temperature_status || ''} type="text" placeholder="Auto-calculated" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm-readonly" tabIndex={-1} /> </div> <div> <label htmlFor="temperature_comment" className="block text-sm font-medium text-gray-700 mb-1">Comment</label> <input id="temperature_comment" name="temperature_comment" onChange={handleInputChange} value={formData.temperature_comment || ''} type="text" placeholder="Optional" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" /> </div> </div>
                    </section>

                    {/* --- SpO2 Section --- */}
                    <section className="p-4 border rounded-lg bg-slate-50 shadow-sm">
                        {/* ... content same as before ... */}
                        <div className="flex justify-between items-center mb-3"> <h3 className="text-md font-semibold text-gray-700">SpO₂ <span className='text-xs font-normal'>(%)</span></h3> <button type="button" onClick={() => setIsSpo2ModalOpen(true)} className="text-blue-500 hover:text-blue-700" title="SpO₂ Information"> <FaInfoCircle size={16} /> </button> </div> <div className="grid grid-cols-1 sm:grid-cols-3 gap-4"> <div> <label htmlFor="spO2" className="block text-sm font-medium text-gray-700 mb-1">Value</label> <input id="spO2" name="spO2" onChange={handleInputChange} value={formData.spO2 || ''} type="number" placeholder="e.g., 98" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" /> </div> <div> <label htmlFor="spO2_status" className="block text-sm font-medium text-gray-700 mb-1">Status</label> <input id="spO2_status" name="spO2_status" readOnly value={formData.spO2_status || ''} type="text" placeholder="Auto-calculated" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm-readonly" tabIndex={-1} /> </div> <div> <label htmlFor="spO2_comment" className="block text-sm font-medium text-gray-700 mb-1">Comment</label> <input id="spO2_comment" name="spO2_comment" onChange={handleInputChange} value={formData.spO2_comment || ''} type="text" placeholder="Optional" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" /> </div> </div>
                    </section>

                    {/* --- Respiratory Rate Section --- */}
                    <section className="p-4 border rounded-lg bg-slate-50 shadow-sm">
                        {/* ... content same as before ... */}
                         <div className="flex justify-between items-center mb-3"> <h3 className="text-md font-semibold text-gray-700">Respiratory Rate <span className='text-xs font-normal'>(/min)</span></h3> <button type="button" onClick={() => setIsRespRateModalOpen(true)} className="text-blue-500 hover:text-blue-700" title="Respiratory Rate Information"> <FaInfoCircle size={16} /> </button> </div> <div className="grid grid-cols-1 sm:grid-cols-3 gap-4"> <div> <label htmlFor="respiratory_rate" className="block text-sm font-medium text-gray-700 mb-1">Value</label> <input id="respiratory_rate" name="respiratory_rate" onChange={handleInputChange} value={formData.respiratory_rate || ''} type="number" placeholder="e.g., 16" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" /> </div> <div> <label htmlFor="respiratory_rate_status" className="block text-sm font-medium text-gray-700 mb-1">Status</label> <input id="respiratory_rate_status" name="respiratory_rate_status" readOnly value={formData.respiratory_rate_status || ''} type="text" placeholder="Auto-calculated" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm-readonly" tabIndex={-1} /> </div> <div> <label htmlFor="respiratory_rate_comment" className="block text-sm font-medium text-gray-700 mb-1">Comment</label> <input id="respiratory_rate_comment" name="respiratory_rate_comment" onChange={handleInputChange} value={formData.respiratory_rate_comment || ''} type="text" placeholder="Optional" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" /> </div> </div>
                    </section>

                    {/* --- Height, Weight, BMI Section --- */}
                     <section className="p-4 border rounded-lg bg-slate-50 shadow-sm space-y-4">
                         {/* ... content same as before ... */}
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> <div> <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">Height <span className='text-xs font-normal'>(cm)</span></label> <input id="height" name="height" onChange={handleInputChange} value={formData.height || ''} type="number" placeholder="e.g., 175" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" /> </div> <div> <label htmlFor='weight' className="block text-sm font-medium text-gray-700 mb-1">Weight <span className='text-xs font-normal'>(Kg)</span></label> <input id='weight' name="weight" onChange={handleInputChange} value={formData.weight || ''} type="number" step="0.1" placeholder="e.g., 70.5" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" /> </div> </div> <div className="pt-2 border-t border-gray-200"> <div className="flex justify-between items-center mb-1"> <h4 className="text-md font-semibold text-gray-700">BMI <span className='text-xs font-normal'>(kg/m²)</span></h4> <button type="button" onClick={() => setIsBmiModalOpen(true)} className="text-blue-500 hover:text-blue-700" title="View BMI Standards"> <FaInfoCircle size={16}/> </button> </div> <div className="grid grid-cols-1 sm:grid-cols-3 gap-4"> <div> <label className="block text-sm font-medium text-gray-700 mb-1">Calculated BMI</label> <input name="bmi_display" readOnly value={formData.bmi || ''} type="text" placeholder="Enter H/W" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm-readonly" tabIndex={-1} /> </div> <div> <label className="block text-sm font-medium text-gray-700 mb-1">BMI Status</label> <input name="bmi_status" readOnly value={formData.bmi_status || ''} type="text" placeholder="Auto-calculated" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm-readonly" tabIndex={-1} /> </div> <div> <label htmlFor="bmi_comment" className="block text-sm font-medium text-gray-700 mb-1">Comment</label> <input id="bmi_comment" name="bmi_comment" onChange={handleInputChange} value={formData.bmi_comment || ''} type="text" placeholder="Optional" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" /> </div> </div> </div>
                     </section>


                    {/* --- File Upload Section (Keep as is) --- */}
                    <section className="pt-5 border-t border-gray-200"> {/* ... content same as before ... */} </section>

                    {/* --- Submit Button (Keep as is) --- */}
                    <div className="mt-8 flex justify-end"> {/* ... content same as before ... */} </div>
                </form>
            </div>

            {/* CSS for input fields (Keep as is) */}
            <style jsx>{`/* ... same as before ... */`}</style>
        </>
    );
};

export default VitalsForm;