import React from "react";

const VitalsForm = ({ data }) => {
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
        <div className="relative w-28 h-28 mx-auto">
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
            <p className="text-xs font-medium text-gray-600">Mean BP</p>
            <p className={`text-lg font-bold text-${meterColor}-600`}>{meanBP.toFixed(1)} mmHg</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Vitals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Systolic</label>
          <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 text-sm shadow-sm">
            {data.systolic || "No data available"}
          </div>

          <label className="block text-gray-700 text-sm font-medium mb-1 mt-3">Diastolic</label>
          <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 text-sm shadow-sm">
            {data.diastolic || "No data available"}
          </div>
        </div>

        {/* Visualization */}
        <div className="border border-gray-300 rounded-lg p-4 bg-blue-50 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Pictorial Representation</h3>
          {renderVisualization(data.systolic, data.diastolic)}
        </div>
      </div>

      {/* Additional Vitals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {["pulse", "respiratory_rate", "temperature", "spO2", "weight", "height", "bmi"].map((key) => (
          <div key={key}>
            <label className="block text-gray-700 text-sm font-medium mb-1 capitalize">
              {key.replace("_", " ")}
            </label>
            <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 text-sm shadow-sm">
              {data[key] || "No data available"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VitalsForm;
