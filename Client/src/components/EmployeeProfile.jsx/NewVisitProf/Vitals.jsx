import React from 'react';

const VitalsForm = ({ data }) => {
  const renderVisualization = (systolic, diastolic) => {
    if (!systolic || !diastolic) {
      return <p className="text-gray-700">Please enter both Systolic and Diastolic values to view the visualization.</p>;
    }

    const systolicValue = parseInt(systolic, 10);
    const diastolicValue = parseInt(diastolic, 10);

    let status = "Normal";
    let imageUrl = "normal.png";

    if (systolicValue > 120 || diastolicValue > 80) {
      status = "Elevated";
      imageUrl = "elevated.png";
    }
    if (systolicValue > 140 || diastolicValue > 90) {
      status = "Hypertension";
      imageUrl = "hypertension.png";
    }

    return (
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2">{status}</h3>
        <img src={imageUrl} alt={status} className="max-w-full h-auto mx-auto" />
      </div>
    );
  };

  return (
    <div className="mt-8 p-4">
      <h2 className="text-lg font-medium mb-4">Vitals</h2>
      <div className="grid grid-cols-3 gap-4 mb-16">
        <div>
          <label className="block text-sm font-medium text-gray-700">Systolic (mm Hg)</label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
            {data.systolic || 'No data available'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Diastolic (mm Hg)</label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
            {data.diastolic || 'No data available'}
          </div>
        </div>
        <div className="col-span-3 border border-gray-300 rounded-md p-4 bg-blue-50 shadow-sm">
          <h3 className="text-md font-medium mb-2">Pictorial Representation</h3>
          {renderVisualization(data.systolic, data.diastolic)}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Pulse (per min)</label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
            {data.pulse || 'No data available'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Respiratory Rate (per min)</label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
            {data.respiratory_rate || 'No data available'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Temperature (°F)</label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
            {data.temperature || 'No data available'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">SpO2 (%)</label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
            {data.spO2 || 'No data available'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
            {data.weight || 'No data available'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
            {data.height || 'No data available'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">BMI</label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm flex items-center">
            {data.bmi || 'No data available'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VitalsForm;
