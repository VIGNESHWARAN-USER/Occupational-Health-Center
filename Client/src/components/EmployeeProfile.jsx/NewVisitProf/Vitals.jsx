import React, { useState, useEffect } from "react";

const VitalsForm = ({ data, onChange, onSubmit }) => {
  const [formData, setFormData] = useState({
    systolic: "",
    diastolic: "",
    pulse: "",
    pulseComments: "",
    respiratory_rate: "",
    repoComments: "",
    temperature: "",
    temperatureComments: "",
    spO2: "",
    Spo2Comments: "",
    weight: "",
    height: "",
    bmi: "",
  });

  useEffect(() => {
    // Initialize form data from props if available
    if (data) {
      setFormData({
        systolic: data.systolic || "",
        diastolic: data.diastolic || "",
        pulse: data.pulse || "",
        pulseComments: data.pulseComments || "",
        respiratory_rate: data.respiratory_rate || "",
        repoComments: data.repoComments || "",
        temperature: data.temperature || "",
        temperatureComments: data.temperatureComments || "",
        spO2: data.spO2 || "",
        Spo2Comments: data.Spo2Comments || "",
        weight: data.weight || "",
        height: data.height || "",
        bmi: data.bmi || "",
      });
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (onChange) {
      onChange({ ...formData, [name]: value }); // Pass the form data back to the parent
    }
  };

  const renderVisualization = (systolic, diastolic) => {
    if (!systolic || !diastolic) {
      return (
        <p className="text-gray-600 italic">
          Enter both Systolic and Diastolic values for visualization.
        </p>
      );
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white mt-8 p-4">
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: "1rem" }}>
          {formData ? (
            <>
              <div style={{ flex: 1 }}>
                <h3>Blood Pressure</h3>
                <div>
                  <label className="mt-8 block text-sm font-medium text-gray-700">Systolic (mm Hg)</label>
                  <input
                    name="systolic"
                    onChange={handleInputChange}
                    value={formData.systolic || ""}
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
                    value={formData.diastolic || ""}
                    type="text"
                    placeholder="Enter your Diastolic (mm Hg)"
                    className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div style={{ flex: 2, border: "1px solid #ddd", borderRadius: "10px", padding: "1rem" }}>
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
              value={formData.pulse || ""}
              type="text"
              placeholder="Enter the pulse rate"
              className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mt-8">Pulse Comments</label>
            <input
              name="pulseComments"
              onChange={handleInputChange}
              value={formData.pulseComments || ""}
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
              value={formData.respiratory_rate || ""}
              type="text"
              placeholder="Enter the Respiratory Rate"
              className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mt-8">Repository Rate Comments</label>
            <input
              name="repoComments"
              onChange={handleInputChange}
              value={formData.repoComments || ""}
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
              value={formData.temperature || ""}
              type="text"
              placeholder="Enter the temperature"
              className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mt-8">Temperature Comments</label>
            <input
              name="temperatureComments"
              onChange={handleInputChange}
              value={formData.temperatureComments || ""}
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
              value={formData.spO2 || ""}
              type="text"
              placeholder="Enter the spo2"
              className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mt-8">SpO2 Comments</label>
            <input
              name="Spo2Comments"
              onChange={handleInputChange}
              value={formData.Spo2Comments || ""}
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
              value={formData.weight || ""}
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
              value={formData.height || ""}
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
              value={formData.bmi || ""}
              type="text"
              placeholder="Enter the bmi"
              className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-8 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
        >
          {onSubmit ? "Save Vitals" : "Edit Vitals"}
        </button>
      </form>
    </div>
  );
};

export default VitalsForm;