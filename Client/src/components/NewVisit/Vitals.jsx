import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaFileUpload } from 'react-icons/fa';

const VitalsForm = () => {
  const initialData = JSON.parse(localStorage.getItem("selectedEmployee")) || {};
  const [formData, setFormData] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  useEffect(() => {
    if (initialData && initialData.vitals) {
      setFormData(initialData.vitals);
      formData.emp_no = initialData.emp_no;
    }
  }, []);

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
      const updatedformdata = { ...formData, emp_no: initialData.emp_no }
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
    <div className="bg-white mt-8 p-4">
      <div style={{ display: 'flex', gap: '1rem' }}>
        {formData ? (
          <>
            <div style={{ flex: 1 }}>
              <h3>Blood Pressure</h3>
              <div>
                <label className="mt-8 block text-sm font-medium text-gray-700">Systolic (mm Hg)</label>
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
                <label className="mt-8 block text-sm font-medium text-gray-700">Diastolic (mm Hg)</label>
                <input
                  name="diastolic"
                  onChange={handleInputChange}
                  value={formData.diastolic || ''}
                  type="text"
                  placeholder="Enter your Diastolic (mm Hg)"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div style={{ flex: 2, border: '1px solid #ddd', borderRadius: '10px', padding: '1rem' }}>
              <h3>Pictorial Representation</h3>
              {renderVisualization(formData.systolic, formData.diastolic)}
            </div>
          </>
        ) : (
          <p>No data found</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mt-8">Pulse (Per Minute)</label>
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
          <label className="block text-sm font-medium text-gray-700 mt-8">Pulse Comments</label>
          <input
            name="pulse comments"
            onChange={handleInputChange}
            value={formData.pulseComments || ''}
            type="text"
            placeholder="Enter the pulse comments"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mt-8">Respiratory Rate (Per Minute)</label>
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
          <label className="block text-sm font-medium text-gray-700 mt-8">Repository Rate Comments</label>
          <input
            name="Repository comments"
            onChange={handleInputChange}
            value={formData.repoComments || ''}
            type="text"
            placeholder="Enter the Repository Rate comments"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mt-8">Temperature (in °F)</label>
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
          <label className="block text-sm font-medium text-gray-700 mt-8">Temperature Comments</label>
          <input
            name="temperature comments"
            onChange={handleInputChange}
            value={formData.temperatureComments || ''}
            type="text"
            placeholder="Enter the temperature comments"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mt-8">SpO2 (in %)</label>
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
          <label className="block text-sm font-medium text-gray-700 mt-8">SpO2 Comments</label>
          <input
            name="SpO2 comments"
            onChange={handleInputChange}
            value={formData.Spo2Comments || ''}
            type="text"
            placeholder="Enter the SpO2 comments"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className='grid grid-cols-3 gap-4 mt-8'>
        <div>
          <label className="block text-sm font-medium text-gray-700 mt-8">Weight (in KG)</label>
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
          <label className="block text-sm font-medium text-gray-700 mt-8">Height (in CM)</label>
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
          <label className="block text-sm font-medium text-gray-700 mt-8">BMI</label>
          <input
            name="bmi"
            onChange={handleInputChange}
            value={formData.bmi || ''}
            type="text"
            placeholder="Enter the bmi"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>



      {/* File Upload Section - Moved to the bottom */}
      <div className="mt-8">
        <h3>Upload Documents</h3>
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
      </div>

      <button onClick={handleSubmit} className="mt-8 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300">
        Add Vitals
      </button>
    </div>
  );
};

export default VitalsForm;