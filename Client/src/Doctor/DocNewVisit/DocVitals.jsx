// Vitals
import React, { useState } from 'react';

const VitalsForm = () => {
  const [formData, setFormData] = useState({
    Systolic: '',
    Diastolic: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const renderVisualization = (systolic, diastolic) => {
    if (!systolic || !diastolic) {
      return <p>Please enter both Systolic and Diastolic values to view the visualization.</p>;
    }

    const systolicValue = parseInt(systolic, 10);
    const diastolicValue = parseInt(diastolic, 10);

    let status = "Normal";
    let imageUrl = "normal.png"; // Replace with the path to your normal image

    if (systolicValue > 120 || diastolicValue > 80) {
      status = "Elevated";
      imageUrl = "elevated.png"; // Replace with the path to your elevated image
    }
    if (systolicValue > 140 || diastolicValue > 90) {
      status = "Hypertension";
      imageUrl = "hypertension.png"; // Replace with the path to your hypertension image
    }

    return (
      <div style={{ textAlign: 'center' }}>
        <h3>{status}</h3>
        <img src={imageUrl} alt={status} style={{ maxWidth: '100%', height: 'auto' }} />
      </div>
    );
  };

  return (
    <div className="bg-white mt-8 p-4">
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <h3>Blood Pressure</h3>
          <div>
            <label className="mt-8 block text-sm font-medium text-gray-700 mt-8">Systolic (mm Hg)</label>
            <input
              type="text"
              placeholder="Enter your Systolic (mm Hg)"
              className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mt-8 block text-sm font-medium text-gray-700 mt-8">Diastolic (mm Hg)</label>
            <input
              type="text"
              placeholder="Enter your Diastolic (mm Hg)"
              className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div style={{ flex: 2, border: '1px solid #ddd', borderRadius: '10px', padding: '1rem' }}>
          <h3>Pictorial Representation</h3>
          {renderVisualization(formData.Systolic, formData.Diastolic)}
        </div>
        
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mt-8">Pulse (Per Minute)</label>
          <input
            type="text"
            placeholder="Enter the pulse rate"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mt-8">Respiratory Rate (Per Minute)</label>
          <input
            type="text"
            placeholder="Enter the Respiratory Rate"
            
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mt-8">Temperature (in °F)</label>
          <input
            type="text"
            placeholder="Enter the temperature"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mt-8">SpO2 (in %)</label>
          <input
            type="text"
            placeholder="Enter the spo2"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mt-8">Weight (in KG)</label>
          <input
            type="text"
            placeholder="Enter the weight"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mt-8">Height (in CM)</label>
          <input
            type="text"
            placeholder="Enter the height"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mt-8">BMI</label>
          <input
            type="text"
            placeholder="Enter the bmi"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default VitalsForm;