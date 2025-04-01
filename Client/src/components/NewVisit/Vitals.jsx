import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaFileUpload } from 'react-icons/fa';

const VitalsForm = ({data}) => {
    const initialData = data[0] || {};
    const [formData, setFormData] = useState({});
    const [selectedFiles, setSelectedFiles] = useState({});

    console.log(initialData)
    useEffect(() => {
        const initial = initialData;

        if (initial && initial.vitals) {
            // Create a copy of initial.vitals to avoid modifying it directly
            const initialVitals = { ...initial.vitals, emp_no: initial.emp_no };
            setFormData(initialVitals);
        } else {
            // Initialize formData with empty strings for all fields if no vitals data is found
            setFormData({
                systolic: '',
                systolic_status: '',
                systolic_comment: '',
                diastolic: '',
                diastolic_status: '',
                diastolic_comment: '',
                pulse: '',
                pulse_status: '',
                pulse_comment: '',
                respiratory_rate: '',
                respiratory_rate_status: '',
                respiratory_rate_comment: '',
                temperature: '',
                temperature_status: '',
                temperature_comment: '',
                spO2: '',
                spO2_status: '',
                spO2_comment: '',
                weight: '',
                weight_status: '',
                weight_comment: '',
                height: '',
                height_status: '',
                height_comment: '',
                bmi: '',
                bmi_status: '',
                bmi_comment: '',
            });
        }
    }, []); // Empty dependency array means this useEffect runs only once on mount


    const handleFileChange = (event, type) => {
        const file = event.target.files[0];
        setSelectedFiles((prevFiles) => ({ ...prevFiles, [type]: file }));
    };

    const handleBrowseClick = (type) => {
        document.getElementById(type).click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();

        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        if (selectedFiles.SelfDeclaration) {
            formDataToSend.append('SelfDeclaration', selectedFiles.SelfDeclaration);
        }
        if (selectedFiles.FCExternal) {
            formDataToSend.append('FCExternal', selectedFiles.FCExternal);
        }
        if (selectedFiles.Reports) {
            formDataToSend.append('Reports', selectedFiles.Reports);
        }

        try {
             
            console.log(initialData.emp_no)
            const updatedformdata = { ...formData }
            console.log(updatedformdata)
            const resp = await axios.post("https://occupational-health-center-1.onrender.com/addvitals", updatedformdata)
            if (resp.status === 200) {
                alert("Vitals added successfully")
            }
        } catch (error) {
            console.error("Error adding vitals:", error);
            alert("An Error Occurred: " + error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const renderVisualization = (systolic, diastolic) => {
        if (!systolic || !diastolic) {
            return <p className="text-gray-600 italic">Enter both Systolic and Diastolic values for visualization.</p>;
        }

        const systolicValue = parseInt(systolic, 10);
        const diastolicValue = parseInt(diastolic, 10);

        // Calculate Mean Arterial Pressure (MAP)
        const meanBP = diastolicValue + (systolicValue - diastolicValue) / 3;

        let status = "Normal";
        let meterColor = "green"; // Default color for Normal
        let percentValue = Math.min((meanBP / 200) * 100, 100); // Normalize percentage for visualization

        // Determine status based on mean BP
        if (meanBP > 100 && meanBP <= 120) {
            status = "Elevated";
            meterColor = "yellow";
        }
        if (meanBP > 120) {
            status = "Hypertension";
            meterColor = "red";
        }

        return (
            <div className="text-center">
                <h3 className={`text-md font-semibold text-${meterColor}-600 mb-2`}>{status}</h3>

                {/* Reduced Size Circular Gauge */}
                <div className="relative w-32 h-32 mx-auto">
                    <svg className="w-full h-full" viewBox="0 0 36 36" transform="rotate(-90)">
                        {/* Background Circle */}
                        <circle
                            className="text-gray-300"
                            cx="18"
                            cy="18"
                            r="15.915"
                            strokeWidth="2"
                            fill="none"
                            stroke="currentColor"
                        />
                        {/* Foreground Circle (Progress Indicator) */}
                        <circle
                            className={`text-${meterColor}-500`}
                            cx="18"
                            cy="18"
                            r="15.915"
                            strokeWidth="2"
                            strokeDasharray={`${percentValue}, 100`}
                            strokeLinecap="round"
                            fill="none"
                            stroke="currentColor"
                        />
                    </svg>
                    {/* Text Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-xm font-medium text-gray-600">Mean BP</p>
                        <p className={`text-sm font-bold text-${meterColor}-600`}>{meanBP.toFixed(1)} mmHg</p>
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div className="bg-white mt-8 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Vitals Form</h2>

            {/* Blood Pressure Section */}
            <section className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Blood Pressure</h3>
                <div className="grid grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Systolic (mm Hg)</label>
                        <input
                            name="systolic"
                            onChange={handleInputChange}
                            value={formData.systolic || ''}
                            type="text"
                            placeholder="Enter your Systolic (mm Hg)"
                            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Systolic Status</label>
                        <input
                            name="systolic_status"
                            onChange={handleInputChange}
                            value={formData.systolic_status || ''}
                            type="text"
                            placeholder="Enter Systolic Status"
                            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Systolic Comment</label>
                        <input
                            name="systolic_comment"
                            onChange={handleInputChange}
                            value={formData.systolic_comment || ''}
                            type="text"
                            placeholder="Enter Systolic Comment"
                            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Diastolic (mm Hg)</label>
                        <input
                            name="diastolic"
                            onChange={handleInputChange}
                            value={formData.diastolic || ''}
                            type="text"
                            placeholder="Enter your Diastolic (mm Hg)"
                            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Diastolic Status</label>
                        <input
                            name="diastolic_status"
                            onChange={handleInputChange}
                            value={formData.diastolic_status || ''}
                            type="text"
                            placeholder="Enter Diastolic Status"
                            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Diastolic Comment</label>
                        <input
                            name="diastolic_comment"
                            onChange={handleInputChange}
                            value={formData.diastolic_comment || ''}
                            type="text"
                            placeholder="Enter Diastolic Comment"
                            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                {/* Blood Pressure Visualization  */}
                <div className="mt-4">
                    <h4 className="text-md font-semibold text-gray-700 mb-2">Visualization</h4>
                    {renderVisualization(formData.systolic, formData.diastolic)}
                </div>
            </section>

            {/* Pulse Section */}
            <section className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Pulse</h3>
                <div className="grid grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Pulse (Per Minute)</label>
                        <input
                            name="pulse"
                            onChange={handleInputChange}
                            value={formData.pulse || ''}
                            type="text"
                            placeholder="Enter the pulse rate"
                            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Pulse Status</label>
                        <input
                            name="pulse_status"
                            onChange={handleInputChange}
                            value={formData.pulse_status || ''}
                            type="text"
                            placeholder="Enter the pulse Status"
                            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Pulse Comments</label>
                        <input
                            name="pulse_comment"
                            onChange={handleInputChange}
                            value={formData.pulse_comment || ''}
                            type="text"
                            placeholder="Enter the pulse comments"
                            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </section>

            {/* Respiratory Rate Section */}
            <section className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Respiratory Rate</h3>
                <div className="grid grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Respiratory Rate (Per Minute)</label>
                        <input
                            name="respiratory_rate"
                            onChange={handleInputChange}
                            value={formData.respiratory_rate || ''}
                            type="text"
                            placeholder="Enter the Respiratory Rate"
                            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Respiratory Rate Status</label>
                        <input
                            name="respiratory_rate_status"
                            onChange={handleInputChange}
                            value={formData.respiratory_rate_status || ''}
                            type="text"
                            placeholder="Enter the respiratory_rate Status"
                            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Respiratory Rate Comments</label>
                        <input
                            name="respiratory_rate_comment"
                            onChange={handleInputChange}
                            value={formData.respiratory_rate_comment || ''}
                            type="text"
                            placeholder="Enter the Repository Rate comments"
                            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </section>

            {/* Temperature Section */}
            <section className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Temperature</h3>
                <div className="grid grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Temperature (in °F)</label>
                        <input
                            name="temperature"
                            onChange={handleInputChange}
                            value={formData.temperature || ''}
                            type="text"
                            placeholder="Enter the temperature"
                            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Temperature Status</label>
                        <input
                            name="temperature_status"
                            onChange={handleInputChange}
                            value={formData.temperature_status || ''}
                            type="text"
                            placeholder="Enter the temperature Status"
                            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Temperature Comments</label>
                        <input
                            name="temperature_comment"
                            onChange={handleInputChange}
                            value={formData.temperature_comment || ''}
                            type="text"
                            placeholder="Enter the temperature comments"
                            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </section>

            {/* SpO2 Section */}
            <section className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">SpO2</h3>
                <div className="grid grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">SpO2 (in %)</label>
                        <input
                            name="spO2"
                            onChange={handleInputChange}
                            value={formData.spO2 || ''}
                            type="text"
                            placeholder="Enter the spo2"
                            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">SpO2 Status</label>
                        <input
                            name="spO2_status"
                            onChange={handleInputChange}
                            value={formData.spO2_status || ''}
                            type="text"
                            placeholder="Enter the SpO2 status"
                            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">SpO2 Comments</label>
                        <input
                            name="spO2_comment"
                            onChange={handleInputChange}
                            value={formData.spO2_comment || ''}
                            type="text"
                            placeholder="Enter the SpO2 comments"
                            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </section>

            {/* Weight Section */}
            <section className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Weight</h3>
                <div className="grid grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Weight (in KG)</label>
                        <input
                            name="weight"
                            onChange={handleInputChange}
                            value={formData.weight || ''}
                            type="text"
                            placeholder="Enter the weight"
                            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Weight Status</label>
                        <input
                            name="weight_status"
                            onChange={handleInputChange}
                            value={formData.weight_status || ''}
                            type="text"
                            placeholder="Enter the weight Status"
                            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Weight Comment</label>
                        <input
                            name="weight_comment"
                            onChange={handleInputChange}
                            value={formData.weight_comment || ''}
                            type="text"
                            placeholder="Enter the weight comment"
                            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </section>

            {/* Height Section */}
            <section className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Height</h3>
                <div className="grid grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Height (in CM)</label>
                        <input
                            name="height"
                            onChange={handleInputChange}
                            value={formData.height || ''}
                            type="text"
                            placeholder="Enter the height"
                            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Height Status</label>
                        <input
                            name="height_status"
                            onChange={handleInputChange}
                            value={formData.height_status || ''}
                            type="text"
                            placeholder="Enter the height Status"
                            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Height Comment</label>
                        <input
                            name="height_comment"
                            onChange={handleInputChange}
                            value={formData.height_comment || ''}
                            type="text"
                            placeholder="Enter the height comment"
                            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </section>

            {/* BMI Section */}
            <section className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">BMI</h3>
                <div className="grid grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">BMI</label>
                        <input
                            name="bmi"
                            onChange={handleInputChange}
                            value={formData.bmi || ''}
                            type="text"
                            placeholder="Enter the bmi"
                            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">BMI Status</label>
                        <input
                            name="bmi_status"
                            onChange={handleInputChange}
                            value={formData.bmi_status || ''}
                            type="text"
                            placeholder="Enter the bmi Status"
                            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">BMI Comment</label>
                        <input
                            name="bmi_comment"
                            onChange={handleInputChange}
                            value={formData.bmi_comment || ''}
                            type="text"
                            placeholder="Enter the bmi comment"
                            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </section>

            {/* File Upload Section - Moved to the bottom */}
            <section className="mt-8 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Upload Documents</h3>
                <div className="grid grid-cols-4 gap-4">
                    {['SelfDeclaration', 'FCExternal', 'Reports', 'Manual Forms'].map((type) => (
                        <motion.div
                            key={type}
                            className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer mb-4 h-28 bg-white shadow-md hover:shadow-lg transition duration-300"
                            onClick={() => handleBrowseClick(type)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaFileUpload className="text-4xl text-blue-500 mb-2" />
                            <p className="text-gray-700 font-medium">Upload {type.replace(/([A-Z])/g, ' $1')}</p>
                            <p className="text-xs text-gray-500">Click or drag file here</p>
                            <input
                                type="file"
                                id={type}
                                style={{ display: "none" }}
                                onChange={(e) => handleFileChange(e, type)}
                            />
                            {selectedFiles[type] && (
                                <p className="mt-2 text-sm text-gray-600">{selectedFiles[type].name}</p>
                            )}
                        </motion.div>
                    ))}
                </div>
            </section>

            <div className="mt-6 flex justify-end">
                <button onClick={handleSubmit} className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300">
                    Add Vitals
                </button>
            </div>
        </div>
    );
};

export default VitalsForm;